import { type MessageEntry, messageEntrySchema } from "@motherbase/core";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../database";
import { message, session } from "../database/schema";

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

export const appendMessage = (sessionId: string, entry: MessageEntry) => {
  const nextSeq = db
    .select({ max: sql<number>`coalesce(max(${message.seq}), -1) + 1` })
    .from(message)
    .where(eq(message.sessionId, sessionId))
    .get()!.max;

  return db
    .insert(message)
    .values({
      id: crypto.randomUUID(),
      sessionId,
      seq: nextSeq,
      role: entry.role,
      data: JSON.stringify(entry),
      createdAt: Date.now(),
    })
    .returning()
    .get();
};

export const getMessages = (sessionId: string): MessageEntry[] =>
  db
    .select()
    .from(message)
    .where(eq(message.sessionId, sessionId))
    .orderBy(message.seq)
    .all()
    .map((row) => messageEntrySchema.parse(JSON.parse(row.data)));
