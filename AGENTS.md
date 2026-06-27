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

Mock model (`packages/server/tests/helpers/mock-model.ts`): `createMockModel(chunks)` returns a `MockLanguageModelV3` that replays scripted `ModelChunk`s.

### E2E tests

Runner: Playwright. Config at `playwright.config.ts`. Chromium only. Test dir: `tests/e2e/`.

Playwright starts both server (port 4800, `NODE_ENV=test`) and Vite (port 5173) automatically. On non-CI it reuses running servers.

### Test endpoints

Mounted at `/_test/*` only when `NODE_ENV=test`.

**`POST /_test/providers`** - registers fake providers:
```json
{ "providers": [{ "id": "test-provider", "name": "Test Provider", "models": [{ "id": "test-model", "name": "Test Model" }] }] }
```

**`POST /_test/model`** - scripts the next model response:
```json
{ "chunks": [{ "type": "text-delta", "text": "Hello" }, { "type": "finish", "reason": "stop" }] }
```

E2E test setup pattern:
1. Register a test provider via `POST /_test/providers`
2. Script its response via `POST /_test/model`
3. Set active provider/model via `POST /state/provider` and `POST /state/model`
4. Interact with the UI

## Architecture

### History entries

Stored in the `entry` table. Discriminated by `kind` column. JSON `data` column holds the full payload. Currently two kinds: `message` and `error`. `projectForModel` filters to `kind === "message"` before sending history to the model.

### Agent loop

`Runner.send()` appends the user message, streams from the model, accumulates deltas in a `MessageDraft`, emits `message-in-progress` snapshots, persists the completed reply, and emits `message-completed` + `turn-completed`.

## Linting

Biome. 2 spaces, double quotes, 80 char line width. `useBlockStatements: error`, `noNonNullAssertion: off`. Auto-organizes imports.
