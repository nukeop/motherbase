import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dbPath } from "../paths";
import { migrate } from "./migrate";
import * as schema from "./schema";

const isTest = process.env.NODE_ENV === "test";

const createDatabase = () => {
  if (isTest) {
    return new Database(":memory:");
  }
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.run("PRAGMA journal_mode = WAL");
  return db;
};

const sqlite = createDatabase();
migrate(sqlite);

export const db = drizzle(sqlite, { schema });
