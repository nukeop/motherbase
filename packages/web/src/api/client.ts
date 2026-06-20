import type { AppType } from "@motherbase/server/api";
import { hc } from "hono/client";

const API_PORT = import.meta.env.VITE_API_PORT ?? "4800";
export const BASE_URL = `http://localhost:${API_PORT}`;

export const client = hc<AppType>(BASE_URL);
