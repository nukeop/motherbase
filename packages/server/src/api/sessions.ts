import { zValidator } from "@hono/zod-validator";
import type { MessageEntry } from "@motherbase/core";
import { Hono } from "hono";
import { z } from "zod";
import { createModelClient } from "../agent/model-client";
import { Runner } from "../agent/runner";
import { getProvider } from "../providers";
import {
  createSession,
  getMessages,
  listSessions,
} from "../sessions/store";
import { emitToSession } from "../sse/sources/session";
import { requireSession } from "./middleware";
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
  .get("/:id", requireSession, (ctx) => {
    const session = ctx.var.session;
    const messages = getMessages(session.id);

    return ctx.json({ ...session, messages });
  })
  .post(
    "/:id/messages",
    requireSession,
    zValidator("json", z.object({ text: z.string().min(1) })),
    async (ctx) => {
      const session = ctx.var.session;
      const state = await getCurrentState();

      if (!state.provider || !state.model) {
        return ctx.json({ error: "No provider or model selected" }, 400);
      }

      const languageModel = await getProvider(state.provider).createModel(
        state.model,
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
  );
