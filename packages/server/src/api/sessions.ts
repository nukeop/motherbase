import { zValidator } from "@hono/zod-validator";
import { type MessageEntry, permissionReplySchema } from "@motherbase/core";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { createModelClient } from "../agent/model-client";
import { permissions } from "../agent/permissions";
import { Runner } from "../agent/runner";
import { getTools } from "../agent/tools/registry";
import { DEFAULT_SESSION_TITLE } from "../database/schema";
import { bus } from "../events";
import { createCheapModel, getProvider } from "../providers";
import { readConfig } from "../providers/config";
import {
  createSession,
  deleteSession,
  getHistory,
  listSessions,
  updateSession,
} from "../sessions/store";
import { generateSessionTitle } from "../sessions/title";
import { EventStream } from "../sse/event-stream";
import { sessionSource } from "../sse/sources/session";
import { requireSession } from "./middleware";
import {
  createSessionSchema,
  sendMessageSchema,
  sessionParamsSchema,
} from "./session-schemas";

// TODO: this should be gone once I introduce the concept of projects. Placeholder
const DEFAULT_PROJECT_ID = "default";

export const sessionsApi = new Hono()
  .post("/", zValidator("json", createSessionSchema), async (ctx) => {
    const defaults = await readConfig();
    const { directory } = ctx.req.valid("json");
    const session = createSession({
      projectId: DEFAULT_PROJECT_ID,
      providerId: defaults.provider,
      modelId: defaults.model,
      directory,
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

      const { text } = ctx.req.valid("json");
      const userMessage: MessageEntry = {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text }],
      };

      const sessionPermissions = permissions.forSession(session);
      const runner = new Runner(session.id, {
        model,
        tools: () => getTools(),
        authorize: (toolName, claim) =>
          sessionPermissions.authorize(toolName, claim),
      });

      runner.send(userMessage);

      const config = await readConfig();
      const needsTitle =
        config.generateTitles && session.title === DEFAULT_SESSION_TITLE;
      if (needsTitle) {
        generateSessionTitle(session.id, text, { model: createCheapModel });
      }

      return ctx.json(userMessage);
    },
  )
  .post(
    "/:id/permissions/:requestId",
    requireSession,
    zValidator("json", permissionReplySchema),
    (ctx) => {
      bus.emit(ctx.var.session.id, "permission-replied", {
        requestId: ctx.req.param("requestId"),
        reply: ctx.req.valid("json"),
      });
      return ctx.body(null, 204);
    },
  )
  .get("/:id/events", requireSession, (ctx) => {
    const session = ctx.var.session;

    return streamSSE(
      ctx,
      (stream) => new EventStream(stream, [sessionSource(session.id)]).done,
    );
  });
