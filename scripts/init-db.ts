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
    // Users table
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
    
    // Projects table
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

    // Project Members table
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

    // Milestones table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        due_date BLOB,
        completed INTEGER DEFAULT 0,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // Tasks table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        milestone_id INTEGER,
        assignee_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        due_date BLOB,
        estimated_hours INTEGER,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        updated_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL,
        FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Folders table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        parent_id INTEGER,
        path TEXT NOT NULL,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        updated_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
      )
    `);

    // Files table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        folder_id INTEGER,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        file_extension TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        metadata TEXT,
        current_version_id INTEGER,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        updated_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
      )
    `);

    // File Versions table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS file_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        version_number INTEGER NOT NULL,
        created_by_id INTEGER,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        metadata TEXT,
        change_description TEXT,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // File Activities table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS file_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Comments table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        file_id INTEGER,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at BLOB DEFAULT CURRENT_TIMESTAMP,
        updated_at BLOB DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
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
    
    // Add the admin user as a project member
    await db.run(sql`
      INSERT OR IGNORE INTO project_members (project_id, user_id, role)
      VALUES (1, 1, 'owner')
    `);

    // Add a test milestone
    await db.run(sql`
      INSERT OR IGNORE INTO milestones (project_id, name, description, due_date)
      VALUES (1, 'First Release', 'Basic functionality complete', date('now', '+30 days'))
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