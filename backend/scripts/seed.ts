import bcrypt from 'bcryptjs';
import { pool } from '../src/infrastructure/db/pool';
import { CHANNELS } from '../src/modules/dashboard/dashboard.utils';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
const DEFAULT_EMAIL = 'admin@meshcore.local';
const DEFAULT_PASSWORD = 'password123';
const DEFAULT_ROLE = 'tenant_admin';

const ACCOUNTS = [
  { name: 'Apex Holdings', region: 'north-america', segment: 'enterprise', base: 198_000 },
  { name: 'Bluewire Group', region: 'emea', segment: 'mid-market', base: 173_000 },
  { name: 'CoreBridge', region: 'apac', segment: 'enterprise', base: 161_000 },
  { name: 'Delta Vector', region: 'latam', segment: 'smb', base: 124_000 },
  { name: 'Everstream Ltd', region: 'north-america', segment: 'mid-market', base: 110_000 }
];

const daysAgo = (days: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString();
};

const run = async () => {
  const client = await pool.connect();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO tenants (id, name, plan)
      VALUES ($1, 'Acme Tenant', 'starter')
      ON CONFLICT (id) DO NOTHING
      `,
      [DEFAULT_TENANT_ID]
    );

    await client.query(
      `
      INSERT INTO users (tenant_id, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
      SET tenant_id = EXCLUDED.tenant_id,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role
      `,
      [DEFAULT_TENANT_ID, DEFAULT_EMAIL, passwordHash, DEFAULT_ROLE]
    );

    await client.query('DELETE FROM revenue_events WHERE tenant_id = $1', [DEFAULT_TENANT_ID]);
    await client.query('DELETE FROM leads WHERE tenant_id = $1', [DEFAULT_TENANT_ID]);
    await client.query('DELETE FROM accounts WHERE tenant_id = $1', [DEFAULT_TENANT_ID]);

    const accountIds: string[] = [];
    for (const account of ACCOUNTS) {
      const inserted = await client.query(
        `
        INSERT INTO accounts (tenant_id, name, region, segment, status, created_at)
        VALUES ($1, $2, $3, $4, 'active', $5)
        RETURNING id
        `,
        [DEFAULT_TENANT_ID, account.name, account.region, account.segment, daysAgo(120)]
      );
      accountIds.push(inserted.rows[0].id as string);
    }

    const revenueRows: unknown[] = [];
    const revenueValues: string[] = [];
    let paramIndex = 1;

    ACCOUNTS.forEach((account, accountIndex) => {
      for (let day = 0; day < 90; day += 3) {
        const variance = 0.85 + (day % 7) * 0.03;
        const amountCents = Math.round((account.base / 10) * variance * 100);
        const pipelineCents = Math.round(amountCents * 0.95);
        revenueValues.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );
        revenueRows.push(
          DEFAULT_TENANT_ID,
          accountIds[accountIndex],
          amountCents,
          pipelineCents,
          daysAgo(day)
        );
      }
    });

    await client.query(
      `
      INSERT INTO revenue_events (tenant_id, account_id, amount_cents, pipeline_amount_cents, occurred_at)
      VALUES ${revenueValues.join(', ')}
      `,
      revenueRows
    );

    const leadRows: unknown[] = [];
    const leadValues: string[] = [];
    paramIndex = 1;

    for (let day = 0; day < 90; day += 2) {
      for (const channel of CHANNELS) {
        const region = ACCOUNTS[day % ACCOUNTS.length].region;
        const segment = ACCOUNTS[(day + 1) % ACCOUNTS.length].segment;
        const converted = day % 3 !== 0;
        leadValues.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );
        leadRows.push(
          DEFAULT_TENANT_ID,
          channel,
          region,
          segment,
          daysAgo(day),
          converted ? daysAgo(Math.max(0, day - 1)) : null
        );
      }
    }

    await client.query(
      `
      INSERT INTO leads (tenant_id, channel, region, segment, created_at, converted_at)
      VALUES ${leadValues.join(', ')}
      `,
      leadRows
    );

    await client.query('COMMIT');

    console.log('Seed completed');
    console.log(`Tenant ID: ${DEFAULT_TENANT_ID}`);
    console.log(`Email: ${DEFAULT_EMAIL}`);
    console.log(`Password: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
