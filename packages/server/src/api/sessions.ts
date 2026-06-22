import { Hono } from "hono";
import { getSession, listSessions } from "../sessions/store";

export const sessionsApi = new Hono()
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
