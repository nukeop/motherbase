import { cli } from "./cli";
import { initLogger } from "./logger";

await initLogger();
await cli.parse();
