import { Pool } from 'pg';
import { env } from '../../core/config/env';

const isServerless = Boolean(process.env.VERCEL);
const poolConfig = env.databaseUrl
  ? {
      connectionString: env.databaseUrl,
      ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
    }
  : env.db;

export const pool = new Pool({
  ...poolConfig,
  max: isServerless ? 1 : 10,
  idleTimeoutMillis: isServerless ? 5000 : 30_000,
  connectionTimeoutMillis: 10_000
});
