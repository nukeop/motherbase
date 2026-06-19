import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { providersCommand } from "./providers";
import { serveCommand } from "./serve";

export const cli = yargs(hideBin(process.argv))
  .scriptName("motherbase")
  .command(serveCommand)
  .command(providersCommand)
  .strict()
  .help();
