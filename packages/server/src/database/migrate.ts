import type { Database } from "bun:sqlite";

export const migrate = (sqlite: Database) => {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      parent_session_id TEXT,
      title TEXT NOT NULL DEFAULT 'New session',
      provider_id TEXT NOT NULL,
      model_id TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS entry (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES session(id),
      seq INTEGER NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('message', 'error')),
      role TEXT CHECK (role IS NULL OR role IN ('user', 'assistant')),
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
  sqlite.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS entry_session_seq_idx ON entry(session_id, seq)
  `);
};
