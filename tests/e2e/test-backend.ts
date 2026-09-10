import type { APIRequestContext } from "@playwright/test";
import type { HistoryEntry } from "../../packages/core/src/history";
import type { ModelChunk } from "../../packages/server/src/agent/model-chunk";
import type { TestTool } from "../../packages/server/src/api/test-schemas";
import type { TestProvider } from "./test-provider";

export const SERVER_URL = "http://localhost:4800";

type ModelScript = { chunks: ModelChunk[]; error?: string };

export class TestBackend {
  constructor(
    private readonly request: APIRequestContext,
    private readonly provider: TestProvider,
  ) {}

  async registerProvider(): Promise<void> {
    await this.request.post(`${SERVER_URL}/_test/providers`, {
      data: { providers: [this.provider] },
    });
  }

  async registerTools(tools: TestTool[]): Promise<void> {
    await this.request.post(`${SERVER_URL}/_test/tools`, { data: { tools } });
  }

  async scriptTurn(
    chunks: ModelChunk[],
    model = this.provider.models[0].id,
  ): Promise<void> {
    await this.script({ chunks }, model);
  }

  async scriptFailure(
    error: string,
    model = this.provider.models[0].id,
  ): Promise<void> {
    await this.script({ chunks: [], error }, model);
  }

  async history(sessionId: string): Promise<HistoryEntry[]> {
    const response = await this.request.get(
      `${SERVER_URL}/sessions/${sessionId}`,
    );
    const session = await response.json();
    return session.messages;
  }

  private async script(script: ModelScript, model: string): Promise<void> {
    await this.request.post(`${SERVER_URL}/_test/model`, {
      data: { provider: this.provider.id, model, ...script },
    });
  }
}
