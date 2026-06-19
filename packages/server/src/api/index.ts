import { Hono } from "hono";
import { eventsApi } from "./events";
import { providersApi } from "./providers";

export const app = new Hono()
  .route("/providers", providersApi)
  .route("/events", eventsApi);

export type AppType = typeof app;
