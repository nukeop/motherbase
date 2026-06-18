import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { providersCommand } from "./providers";

export const cli = yargs(hideBin(process.argv))
  .scriptName("motherbase")
  .command(providersCommand)
  .demandCommand(1, "Specify a command")
  .strict()
  .help();
