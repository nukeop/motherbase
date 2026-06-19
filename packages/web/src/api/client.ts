import type { AppType } from "@motherbase/server/api";
import { hc } from "hono/client";

const BASE_URL = "http://localhost:4800";

export const client = hc<AppType>(BASE_URL);
