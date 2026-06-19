import { getLogger } from "@logtape/logtape";
import type { CommandModule } from "yargs";
import { app } from "../api";

const logger = getLogger(["Motherbase", "Server"]);

const DEFAULT_PORT = 4800;

export const serveCommand: CommandModule = {
  command: "$0",
  describe: "Start the Motherbase server",
  builder: (yargs) =>
    yargs.option("port", {
      type: "number",
      default: DEFAULT_PORT,
      describe: "Port to listen on",
    }),
  handler: async (args) => {
    const port = args.port as number;
    Bun.serve({
      port,
      fetch: app.fetch,
    });
    logger.info`Server listening on http://localhost:${port}`;
  },
};
