import { pool } from '../src/infrastructure/db/pool';
const run = async () => {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS tenants (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, plan TEXT NOT NULL DEFAULT 'starter', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id UUID NOT NULL REFERENCES tenants(id), email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS api_keys (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id UUID NOT NULL REFERENCES tenants(id), name TEXT NOT NULL, key_hash TEXT NOT NULL, key_prefix TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      segment TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS revenue_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      amount_cents BIGINT NOT NULL,
      pipeline_amount_cents BIGINT NOT NULL DEFAULT 0,
      occurred_at TIMESTAMP WITH TIME ZONE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      channel TEXT NOT NULL,
      region TEXT NOT NULL,
      segment TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL,
      converted_at TIMESTAMP WITH TIME ZONE
    );
    CREATE INDEX IF NOT EXISTS idx_accounts_tenant ON accounts(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_revenue_events_tenant_occurred ON revenue_events(tenant_id, occurred_at);
    CREATE INDEX IF NOT EXISTS idx_leads_tenant_created ON leads(tenant_id, created_at);
  `);
  console.log('Migrations applied');
  await pool.end();
};
run().catch((error) => { console.error(error); process.exit(1); });
