import type { AppType } from "@motherbase/server/api";
import type { ClientResponse } from "hono/client";
import { hc } from "hono/client";

const API_PORT = import.meta.env.VITE_API_PORT ?? "4800";
export const BASE_URL = `http://localhost:${API_PORT}`;

export const client = hc<AppType>(BASE_URL);

const isJson = (response: Response): boolean =>
  response.headers.get("content-type")?.includes("application/json") ?? false;

const errorMessage = async (response: Response): Promise<string> => {
  if (isJson(response)) {
    const { error } = await response.json();
    return error;
  }
  return `Request failed: ${response.status}`;
};

export const unwrap = async <T extends ClientResponse<unknown>>(
  response: T,
): Promise<Extract<T, { ok: true }>> => {
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return response as Extract<T, { ok: true }>;
};
