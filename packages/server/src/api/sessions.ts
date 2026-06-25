import { Hono } from "hono";
import {
  createSession,
  getMessages,
  getSession,
  listSessions,
} from "../sessions/store";
import { getCurrentState } from "./state";

// TODO: this should be gone once I introduce the concept of projects. Placeholder
const DEFAULT_PROJECT_ID = "default";

export const sessionsApi = new Hono()
  .post("/", async (ctx) => {
    const state = await getCurrentState();
    const session = createSession({
      projectId: DEFAULT_PROJECT_ID,
      providerId: state.provider,
      modelId: state.model,
    });
    return ctx.json(session, 201);
  })
  .get("/", (ctx) => {
    return ctx.json(listSessions());
  })
  .get("/:id", (ctx) => {
    const session = getSession(ctx.req.param("id"));

    if (!session) {
      return ctx.json({ error: "Session not found" }, 404);
    }

    const messages = getMessages(session.id);

    return ctx.json({ ...session, messages });
  });
