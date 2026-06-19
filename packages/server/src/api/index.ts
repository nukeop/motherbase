import { Hono } from "hono";
import { cors } from "hono/cors";
import { eventsApi } from "./events";
import { providersApi } from "./providers";

export const app = new Hono()
  .use(cors())
  .route("/providers", providersApi)
  .route("/events", eventsApi);

export type AppType = typeof app;
