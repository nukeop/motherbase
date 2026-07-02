import { cli } from "./cli";
import { startup } from "./startup";

await startup();
await cli.parse();
