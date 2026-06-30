import { zValidator } from "@hono/zod-validator";
import type { MessageEntry } from "@motherbase/core";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { createModelClient } from "../agent/model-client";
import { Runner } from "../agent/runner";
import { getProvider } from "../providers";
import { readConfig } from "../providers/config";
import {
  createSession,
  deleteSession,
  getHistory,
  listSessions,
  updateSession,
} from "../sessions/store";
import { EventStream } from "../sse/event-stream";
import { emitToSession, sessionSource } from "../sse/sources/session";
import { requireSession } from "./middleware";
import { sendMessageSchema, sessionParamsSchema } from "./session-schemas";

// TODO: this should be gone once I introduce the concept of projects. Placeholder
const DEFAULT_PROJECT_ID = "default";

export const sessionsApi = new Hono()
  .post("/", async (ctx) => {
    const defaults = await readConfig();
    const session = createSession({
      projectId: DEFAULT_PROJECT_ID,
      providerId: defaults.provider,
      modelId: defaults.model,
    });
    return ctx.json(session, 201);
  })
  .get("/", (ctx) => {
    return ctx.json(listSessions());
  })
  .get("/:id", requireSession, (ctx) => {
    const session = ctx.var.session;
    const messages = getHistory(session.id);

    return ctx.json({ ...session, messages });
  })
  .delete("/:id", requireSession, (ctx) => {
    deleteSession(ctx.var.session.id);
    return ctx.body(null, 204);
  })
  .patch(
    "/:id",
    requireSession,
    zValidator("json", sessionParamsSchema),
    (ctx) => {
      const session = ctx.var.session;
      const body = ctx.req.valid("json");
      const updated = updateSession(session.id, body);
      return ctx.json(updated);
    },
  )
  .post(
    "/:id/messages",
    requireSession,
    zValidator("json", sendMessageSchema),
    async (ctx) => {
      const session = ctx.var.session;

      if (!session.providerId || !session.modelId) {
        return ctx.json({ error: "No provider or model selected" }, 400);
      }

      const languageModel = await getProvider(session.providerId).createModel(
        session.modelId,
      );
      const model = createModelClient(languageModel);

      const userMessage: MessageEntry = {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: ctx.req.valid("json").text }],
      };

      const runner = new Runner(session.id, {
        model,
        emit: (event) => emitToSession(session.id, event),
      });

      runner.send(userMessage);

      return ctx.json(userMessage);
    },
  )
  .get("/:id/events", requireSession, (ctx) => {
    const session = ctx.var.session;

    return streamSSE(ctx, (stream) =>
      new EventStream(stream, [sessionSource(session.id)]).done,
    );
  });
