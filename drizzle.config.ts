import { defineConfig } from "drizzle-kit";
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
console.log("Drizzle config - NODE_ENV:", process.env.NODE_ENV, "isDev:", isDev);

let config;
if (isDev) {
  config = {
    schema: "./shared/schema.ts",
    out: "./migrations",
    dialect: "sqlite",
    driver: "better-sqlite3",
    dbCredentials: {
      url: path.resolve(process.cwd(), 'data', 'dev.db')
    }
  };
} else {
  config = {
    schema: "./shared/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
      connectionString: process.env.DATABASE_URL || ""
    }
  };
}

export default defineConfig(config);
