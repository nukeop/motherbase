import type { CommandModule } from "yargs";

export const providersCommand: CommandModule = {
  command: "providers",
  describe: "Manage providers and credentials",
  builder: (yargs) =>
    yargs
      .command({
        command: "connect",
        describe: "Connect to a provider",
        handler: async () => {},
      })
      .command({
        command: "list",
        describe: "List configured providers",
        handler: async () => {},
      })
      .command({
        command: "remove",
        describe: "Remove a provider credential",
        handler: async () => {},
      })
      .demandCommand(1, "Specify a subcommand"),
  handler: () => {},
};
