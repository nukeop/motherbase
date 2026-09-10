import type { APIRequestContext } from "@playwright/test";
import { SERVER_URL, TestBackend } from "./test-backend";
import { DEFAULT_TEST_PROVIDER } from "./test-provider";

type TestConfig = {
  provider: string;
  model: string;
  cheap: { provider: string; model: string };
  generateTitles: boolean;
};

const DEFAULT_TEST_CONFIG: TestConfig = {
  provider: DEFAULT_TEST_PROVIDER.id,
  model: DEFAULT_TEST_PROVIDER.models[0].id,
  cheap: {
    provider: DEFAULT_TEST_PROVIDER.id,
    model: DEFAULT_TEST_PROVIDER.models[0].id,
  },
  generateTitles: false,
};

export const setTestConfig = async (
  request: APIRequestContext,
  config: TestConfig = DEFAULT_TEST_CONFIG,
): Promise<void> => {
  await request.post(`${SERVER_URL}/_test/config`, { data: config });
  await new TestBackend(request, DEFAULT_TEST_PROVIDER).registerProvider();
};
