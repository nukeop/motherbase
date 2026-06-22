import { Hono } from "hono";
import { createSession, getSession, listSessions } from "../sessions/store";

const DEFAULT_PROJECT_ID = "default";

export const sessionsApi = new Hono()
  .post("/", (ctx) => {
    const session = createSession(DEFAULT_PROJECT_ID);
    return ctx.json({
      id: session.id,
      title: session.title,
      projectId: session.projectId,
      createdAt: session.createdAt.toISOString(),
    }, 201);
  })
  .get("/", (ctx) => {
    const sessions = listSessions()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((session) => ({
        id: session.id,
        title: session.title,
        projectId: session.projectId,
        createdAt: session.createdAt.toISOString(),
        messageCount: session.history.length,
      }));

    return ctx.json(sessions);
  })
  .get("/:id", (ctx) => {
    const session = getSession(ctx.req.param("id"));

    if (!session) {
      return ctx.json({ error: "Session not found" }, 404);
    }

    return ctx.json({
      id: session.id,
      title: session.title,
      projectId: session.projectId,
      createdAt: session.createdAt.toISOString(),
      history: session.history,
    });
  });
