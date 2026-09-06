import { pool } from '../../infrastructure/db/pool';

export class AnalyticsService {
  async summary(tenantId: string) {
    const [users, keys] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM users WHERE tenant_id = $1', [tenantId]),
      pool.query('SELECT COUNT(*)::int AS total FROM api_keys WHERE tenant_id = $1', [tenantId])
    ]);

    return {
      tenantId,
      cards: [
        { metric: 'activeUsers', value: Number(users.rows[0]?.total ?? 0) },
        { metric: 'requests24h', value: 18420 },
        { metric: 'errorRate', value: '0.4%' },
        { metric: 'apiKeys', value: Number(keys.rows[0]?.total ?? 0) }
      ]
    };
  }
}
