import { Hono } from "hono";
import { cors } from "hono/cors";
import { eventsApi } from "./events";
import { providersApi } from "./providers";
import { sessionsApi } from "./sessions";
import { stateApi } from "./state";

export const app = new Hono()
  .use(cors())
  .route("/state", stateApi)
  .route("/providers", providersApi)
  .route("/events", eventsApi)
  .route("/sessions", sessionsApi);

export type AppType = typeof app;
