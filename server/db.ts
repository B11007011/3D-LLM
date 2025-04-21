import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import path from 'path';
import fs from 'fs';

neonConfig.webSocketConstructor = ws;

// Define variables outside conditional blocks to make them available
let db: any;
let pool: Pool | undefined;

// Use SQLite for development environment
if (process.env.NODE_ENV === 'development') {
  const dbDir = path.resolve(process.cwd(), 'data');
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const sqlite = new Database(path.join(dbDir, 'dev.db'));
  db = drizzleSqlite(sqlite, { schema });
} else {
  // For production, use PostgreSQL
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { db, pool };