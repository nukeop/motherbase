import type { StreamSource } from "../types";

const startedAt = Date.now();

const payload = () => ({
  timestamp: new Date().toISOString(),
  uptime: Math.floor((Date.now() - startedAt) / 1000),
});

export const heartbeat = (intervalMs: number): StreamSource =>
  (write) => {
    const interval = setInterval(async () => {
      try {
        await write("heartbeat", payload());
      } catch {
        clearInterval(interval);
      }
    }, intervalMs);
    return () => clearInterval(interval);
  };
