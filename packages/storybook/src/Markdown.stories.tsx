import { Markdown } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Markdown> = {
  title: "Components/Markdown",
  component: Markdown,
  decorators: [
    (Story) => (
      <div className="bg-cream-dark max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Headings: Story = {
  render: () => (
    <Markdown>
      {`# The Agent Loop

This is a paragraph that follows an h1 heading. It describes how the agent processes incoming messages and decides what to do next.

## Sessions and History

Each session maintains a running history of turns. The history is what the model receives on every call.

### Turn Structure

A turn consists of a user message and one or more assistant responses. Tool calls can appear in between.

#### Metadata

Each turn also carries timestamps, token counts, and a reference to the model that produced it.`}
    </Markdown>
  ),
};

export const InlineFormatting: Story = {
  render: () => (
    <Markdown>
      {`Here's a sentence with **bold text**, *italic text*, and ~~strikethrough~~.

You can also write \`inline code\` like \`const x = 42\` right in the middle of a paragraph.

Links work too: check out [the Hono docs](https://hono.dev) for details on building HTTP servers.`}
    </Markdown>
  ),
};

export const Lists: Story = {
  render: () => (
    <Markdown>
      {`The runner processes events in this order:

- User message arrives
- Message is appended to history
- Model stream begins
- Deltas accumulate in the draft
- Reply is persisted when stream ends

Steps are numbered when order matters:

1. Validate the session exists
2. Lock the session row
3. Send history to the model
4. Write the completed reply
5. Emit \`turn-completed\`

Nested lists work too:

- Providers
  - OpenAI
    - GPT-4o
    - o3
  - Anthropic
    - Claude Sonnet
    - Claude Haiku

Task lists via GFM:

- [x] Add SQLite persistence
- [x] Stream SSE events to the client
- [ ] Implement tool call handling
- [ ] Add syntax highlighting`}
    </Markdown>
  ),
};

export const CodeBlock: Story = {
  render: () => (
    <Markdown>
      {`Here's how you send a message to a session:

\`\`\`typescript
const response = await client.sessions[":id"].messages.$post({
  param: { id: sessionId },
  json: { text: "What's the status of the build?" },
});

const data = await response.json();
\`\`\`

You can also write a block without a language tag:

\`\`\`
POST /sessions/abc123/messages
Content-Type: application/json

{ "text": "Hello" }
\`\`\``}
    </Markdown>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <Markdown>
      {`The spec says:

> The runner must not begin a new turn until the previous one has fully committed to the database. Partial writes are not acceptable.

And later, regarding error handling:

> If the model returns a finish reason of \`error\`, the turn should be recorded with \`kind: "error"\` rather than \`kind: "message"\`. The client will render it differently.

This means we need to handle two distinct paths in the runner.`}
    </Markdown>
  ),
};

export const Table: Story = {
  render: () => (
    <Markdown>
      {`Supported providers and their model counts:

| Provider  | Models | Streaming | Tool calls |
|-----------|--------|-----------|------------|
| OpenAI    | 8      | Yes       | Yes        |
| Anthropic | 4      | Yes       | Yes        |
| Ollama    | Many   | Yes       | Partial    |
| Groq      | 6      | Yes       | No         |

Availability depends on your API key configuration.`}
    </Markdown>
  ),
};

export const FullResponse: Story = {
  render: () => (
    <Markdown>
      {`## Fixing the session lock race condition

The issue is in \`Runner.send()\`. When two messages arrive in rapid succession, both can read the session state before either has committed its reply. The second writer then overwrites the first.

Here's the fix. Wrap the critical section in a transaction and hold the row lock until the reply is written:

\`\`\`typescript
await db.transaction(async (tx) => {
  const session = await tx
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .for("update")
    .get();

  if (!session) throw new Error("Session not found");

  const reply = await streamFromModel(session.history);

  await tx.insert(entries).values({
    sessionId,
    kind: "message",
    data: reply,
  });
});
\`\`\`

A few things to note:

- The \`for("update")\` clause locks the row at read time, so concurrent runners queue up
- The lock releases automatically when the transaction commits or rolls back
- SQLite's WAL mode handles this correctly; no extra config needed

This change also fixes the related issue where **deleted sessions** could still receive replies if a runner was mid-flight when the delete happened. The transaction will fail to find the session and abort cleanly.

See the [Drizzle transactions docs](https://orm.drizzle.team/docs/transactions) for the full API.`}
    </Markdown>
  ),
};
