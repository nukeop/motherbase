import { createMiddleware } from "hono/factory";
import type { SessionRow } from "../database/schema";
import { getSession } from "../sessions/store";

export type WithSession = {
  Variables: {
    session: SessionRow;
  };
};

export const requireSession = createMiddleware<WithSession>(async (ctx, next) => {
  const id = ctx.req.param("id");

  if (!id) {
    return ctx.json({ error: "Missing session ID" }, 400);
  }

  const session = getSession(id);

  if (!session) {
    return ctx.json({ error: "Session not found" }, 404);
  }

  ctx.set("session", session);
  await next();
});
