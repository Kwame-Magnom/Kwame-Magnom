import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export function hasPostgresConfig(): boolean {
  return Boolean(
    process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.SQL_HOST
  );
}

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    const timeoutMs = process.env.VERCEL ? 4500 : 10000;
    if (connectionString) {
      global._postgresPool = new Pool({
        connectionString,
        ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
          ? undefined
          : { rejectUnauthorized: false },
        max: 10,
        connectionTimeoutMillis: timeoutMs,
      });
    } else {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: timeoutMs,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
