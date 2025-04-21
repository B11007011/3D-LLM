import { db } from "../server/db";
import { sql } from "drizzle-orm";
import path from "path";
import fs from "fs";

console.log("Initializing SQLite database for development...");
console.log("NODE_ENV:", process.env.NODE_ENV);

const dataDir = path.resolve(process.cwd(), "data");
const dbPath = path.join(dataDir, "dev.db");

// Check if the data directory exists, create it if it doesn't
if (!fs.existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Check if the database file exists
if (fs.existsSync(dbPath)) {
  console.log(`Database file already exists: ${dbPath}`);
} else {
  console.log(`Creating new database file: ${dbPath}`);
}

async function initDb() {
  try {
    // Create tables
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT 'member'
      )
    `);
    
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date BLOB NOT NULL,
        end_date BLOB,
        status TEXT DEFAULT 'active',
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        updated_at BLOB DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS project_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT DEFAULT 'member',
        joined_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Add a test user
    await db.run(sql`
      INSERT OR IGNORE INTO users (username, password, full_name, email, role)
      VALUES ('admin', 'password123', 'Administrator', 'admin@example.com', 'admin')
    `);

    // Add a test project
    await db.run(sql`
      INSERT OR IGNORE INTO projects (name, description, start_date, status)
      VALUES ('Demo Project', 'A demo project for testing', CURRENT_TIMESTAMP, 'active')
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    console.log("Database initialization completed");
    process.exit(0);
  }
}

initDb(); 