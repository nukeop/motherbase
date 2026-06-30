import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  parentSessionId: text("parent_session_id"),
  title: text("title").notNull().default("New session"),
  providerId: text("provider_id").notNull(),
  modelId: text("model_id").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type SessionRow = InferSelectModel<typeof session>;

export const entry = sqliteTable(
  "entry",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => session.id, { onDelete: "cascade" }),
    seq: integer("seq").notNull(),
    kind: text("kind", { enum: ["message", "error"] }).notNull(),
    role: text("role", { enum: ["user", "assistant"] }),
    data: text("data").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("entry_session_seq_idx").on(table.sessionId, table.seq),
    check("entry_kind_check", sql`${table.kind} IN ('message', 'error')`),
    check("entry_role_check", sql`${table.role} IS NULL OR ${table.role} IN ('user', 'assistant')`),
  ],
);
