import type { AppType } from "@motherbase/server/api";
import type { ClientResponse } from "hono/client";
import { hc } from "hono/client";

const API_PORT = import.meta.env.VITE_API_PORT ?? "4800";
export const BASE_URL = `http://localhost:${API_PORT}`;

export const client = hc<AppType>(BASE_URL);

export const unwrap = <T extends ClientResponse<unknown>>(
  response: T,
): Extract<T, { ok: true }> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response as Extract<T, { ok: true }>;
};
