type TestModel = { id: string; name: string };

export type TestProvider = {
  id: string;
  name: string;
  models: [TestModel, ...TestModel[]];
};

export const DEFAULT_TEST_PROVIDER: TestProvider = {
  id: "default-provider",
  name: "Default Provider",
  models: [{ id: "default-model", name: "Default Model" }],
};
