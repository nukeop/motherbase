# Motherbase

AI coding agent with a browser UI. Bun workspace monorepo.

## Packages

- `packages/core` - shared Zod schemas and types. No runtime deps except zod. Everything depends on this.
- `packages/server` - Hono HTTP server (port 4800). Agent loop, sessions, providers, SSE streaming, SQLite persistence via Drizzle.
- `packages/web` - React SPA (Vite, port 5173). TanStack Router + TanStack Query. Imports `@motherbase/server/api` for typed Hono RPC client.
- `packages/ui` - shared React component library. Tailwind v4.
- `packages/storybook` - Storybook for UI components (port 6006).

## Commands

All from repo root. Package manager is **bun**.

- `bun run dev` - starts server + Vite in parallel
- `bun run typecheck` - tsc across all packages
- `bun run lint` - biome check + autofix
- `bun test` - unit tests (bun test runner)
- `bun run test:e2e` - Playwright e2e tests
- `bun run test:coverage` - unit tests with coverage

## Testing

### Unit tests

Runner: `bun test`. Config in `bunfig.toml`. Preloads `packages/ui/happydom.ts` for DOM environment. Excludes `tests/e2e/`.

Test harness (`packages/server/tests/helpers/scenario.ts`): `Scenario` wires a real in-memory SQLite session, a mock model, and a Runner. Collects emitted `AgentEvent`s.

```ts
const scenario = new Scenario();
scenario.scriptTurn([
  { type: "text-delta", text: "Hello" },
  { type: "finish", reason: "stop" },
]);
await scenario.sendMessage("Hi");
expect(scenario.events).toEqual([...]);
expect(scenario.messages).toEqual([...]);
```

Mock model (`packages/server/tests/helpers/mock-model.ts`): `createMockModel(nextStream)` returns a `MockLanguageModelV3`; each `doStream` call pulls the next scripted stream from the factory. `Scenario.scriptTurn` queues one stream per call, and a tool-calling turn consumes one stream per cycle.

### E2E tests

Runner: Playwright. Config at `playwright.config.ts`. Chromium only. Test dir: `tests/e2e/`.

Playwright starts both server (port 4800, `NODE_ENV=test`) and Vite (port 5173) automatically. On non-CI it reuses running servers.

### Test endpoints

Mounted at `/_test/*` only when `NODE_ENV=test`.

**`POST /_test/providers`** - registers fake providers:
```json
{ "providers": [{ "id": "test-provider", "name": "Test Provider", "models": [{ "id": "test-model", "name": "Test Model" }] }] }
```

**`POST /_test/model`** - queues one model response per call. Each streaming cycle consumes one queued response, so a tool-calling turn needs one post per cycle: a single-call turn takes two (first finishes with `tool-calls`, second with `stop`), and the loop keeps cycling as long as responses finish with `tool-calls`. Chunks are block-structured: a `text-start` must open a block before `text-delta`s extend it.
```json
{ "provider": "test-provider", "model": "test-model", "chunks": [{ "type": "text-start" }, { "type": "text-delta", "text": "Hello" }, { "type": "finish", "reason": "stop" }] }
```

**`POST /_test/tools`** - registers fake tools in the tool registry (replaces by name):
```json
{ "tools": [{ "name": "echo", "description": "Echoes", "behavior": "success", "output": { "echoed": "ping" } }] }
```
`behavior` is `success` (resolves with `output`), `tool-error` (throws `ToolError(message)`), or `crash` (throws `Error(message)`).

E2E test setup pattern:
1. Register a test provider via `POST /_test/providers`
2. Queue its responses via `POST /_test/model` (and register tools via `POST /_test/tools` if the turn calls any)
3. Select the provider and model through the UI (see `selectProvider`/`selectModel` in `tests/e2e/helpers.ts`)
4. Interact with the UI

## Architecture

### History entries

Stored in the `entry` table. Discriminated by `kind` column. JSON `data` column holds the full payload. Three kinds: `message`, `error`, and `tool-result`. `projectForModel` keeps `message` and `tool-result` entries (the `ModelEntry` union) when projecting history for the model; `error` entries are UI-only.

### Agent loop

`Runner.send()` appends the user message, streams from the model, accumulates chunks in a `MessageDraft`, emits `message-in-progress` snapshots, persists the completed reply, and emits `message-completed`. The `completing` state then branches on the finish reason: `stop` ends the turn, `tool-calls` moves to `executing-tool`, which runs each `tool-call` part of the reply sequentially. Every call produces a `tool-result` entry (`outcome: "success" | "error" | "crash"`; a thrown `ToolError` means `error`, any other throw means `crash`) appended to history and emitted as a `tool-result` event. Tool failures never produce `error` entries; the model reads the result and carries on. The loop then re-projects history through `preparing-context` and streams again, repeating until the model finishes with `stop`. `turn-completed` fires once per `send()`.

Tools live in a process-wide registry (`packages/server/src/agent/tools/registry.ts`); the Runner receives a resolver thunk (`Deps.tools`) re-resolved at each `send()` and snapshotted onto the turn's context.

## Linting

Biome. 2 spaces, double quotes, 80 char line width. `useBlockStatements: error`, `noNonNullAssertion: off`. Auto-organizes imports.
