const WEB_API_GLOBALS = [
  "ReadableStream",
  "WritableStream",
  "TransformStream",
  "Request",
  "Response",
  "Headers",
  "fetch",
  "URL",
  "URLSearchParams",
  "Blob",
  "File",
  "FormData",
  "AbortController",
  "AbortSignal",
  "TextEncoder",
  "TextDecoder",
  "crypto",
] as const;

const saved: Record<string, unknown> = {};
for (const key of WEB_API_GLOBALS) {
  if (key in globalThis) {
    saved[key] = globalThis[key as keyof typeof globalThis];
  }
}

await import("bun-test-env-dom");

Object.assign(globalThis, saved);
