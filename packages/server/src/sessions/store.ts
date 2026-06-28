import { type HistoryEntry, type MessageRole, historyEntrySchema } from "@motherbase/core";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../database";
import { entry, session } from "../database/schema";

type CreateSessionParams = {
  projectId: string;
  providerId: string;
  modelId: string;
  parentSessionId?: string;
};

export const createSession = (params: CreateSessionParams) => {
  const id = crypto.randomUUID();
  const row = db
    .insert(session)
    .values({
      id,
      projectId: params.projectId,
      parentSessionId: params.parentSessionId ?? null,
      providerId: params.providerId,
      modelId: params.modelId,
      createdAt: Date.now(),
    })
    .returning()
    .get();
  return row;
};

export const getSession = (id: string) =>
  db.select().from(session).where(eq(session.id, id)).get();

export const listSessions = () =>
  db.select().from(session).orderBy(desc(session.createdAt)).all();

type UpdateSessionParams = {
  providerId?: string;
  modelId?: string;
};

export const updateSession = (id: string, params: UpdateSessionParams) =>
  db
    .update(session)
    .set(params)
    .where(eq(session.id, id))
    .returning()
    .get();

const roleForEntry = (historyEntry: HistoryEntry): MessageRole | null =>
  historyEntry.kind === "message" ? historyEntry.role : null;

export const appendEntry = (sessionId: string, historyEntry: HistoryEntry) => {
  const nextSeq = db
    .select({ max: sql<number>`coalesce(max(${entry.seq}), -1) + 1` })
    .from(entry)
    .where(eq(entry.sessionId, sessionId))
    .get()!.max;

  return db
    .insert(entry)
    .values({
      id: crypto.randomUUID(),
      sessionId,
      seq: nextSeq,
      kind: historyEntry.kind,
      role: roleForEntry(historyEntry),
      data: JSON.stringify(historyEntry),
      createdAt: Date.now(),
    })
    .returning()
    .get();
};

export const getHistory = (sessionId: string): HistoryEntry[] =>
  db
    .select()
    .from(entry)
    .where(eq(entry.sessionId, sessionId))
    .orderBy(entry.seq)
    .all()
    .map((row) => historyEntrySchema.parse(JSON.parse(row.data)));
