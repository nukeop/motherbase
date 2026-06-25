import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  parentSessionId: text("parent_session_id"),
  title: text("title").notNull().default("New session"),
  providerId: text("provider_id").notNull(),
  modelId: text("model_id").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => session.id),
    seq: integer("seq").notNull(),
    role: text("role").notNull(),
    data: text("data").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("message_session_seq_idx").on(table.sessionId, table.seq),
  ],
);
