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
    CREATE TABLE IF NOT EXISTS message (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES session(id),
      seq INTEGER NOT NULL,
      role TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
  sqlite.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS message_session_seq_idx ON message(session_id, seq)
  `);
};
