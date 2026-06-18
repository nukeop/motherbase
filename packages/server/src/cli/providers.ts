import * as p from "@clack/prompts";
import type { CommandModule } from "yargs";
import { allProviders, getProvider } from "../providers";

const onCancel = () => {
  p.cancel("Cancelled.");
  process.exit(0);
};

const connect: CommandModule = {
  command: "connect",
  describe: "Connect to a provider",
  handler: async () => {
    p.intro("Connect to a provider");

    const result = await p.group(
      {
        providerId: () =>
          p.select({
            message: "Select a provider",
            options: allProviders().map((provider) => ({
              label: provider.name,
              value: provider.id,
            })),
          }),
        apiKey: () =>
          p.password({
            message: "Enter your API key",
          }),
      },
      { onCancel },
    );

    const provider = getProvider(result.providerId);
    await provider.setCredential(result.apiKey);

    p.outro(`Connected to ${provider.name}.`);
  },
};

const list: CommandModule = {
  command: "list",
  describe: "List configured providers",
  handler: async () => {
    for (const provider of allProviders()) {
      p.log.info(provider.name);
    }
  },
};

const remove: CommandModule = {
  command: "remove",
  describe: "Remove a provider credential",
  handler: async () => {
    p.intro("Remove a provider credential");

    const result = await p.group(
      {
        providerId: () =>
          p.select({
            message: "Select a provider to remove",
            options: allProviders().map((provider) => ({
              label: provider.name,
              value: provider.id,
            })),
          }),
      },
      { onCancel },
    );

    const provider = getProvider(result.providerId);
    await provider.removeCredential();

    p.outro(`Removed credential for ${provider.name}.`);
  },
};

export const providersCommand: CommandModule = {
  command: "providers",
  describe: "Manage providers and credentials",
  builder: (yargs) =>
    yargs
      .command(connect)
      .command(list)
      .command(remove)
      .demandCommand(1, "Specify a subcommand"),
  handler: () => {},
};
