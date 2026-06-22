import { Session } from "@motherbase/core";

const store = new Map<string, Session>();

export const createSession = (projectId: string): Session => {
  const session = Session.create({ projectId });
  store.set(session.id, session);
  return session;
};

export const getSession = (id: string): Session | undefined => store.get(id);

export const listSessions = (): Session[] => Array.from(store.values());
