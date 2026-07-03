import type { JsonValue } from "@motherbase/core";
import { Volume } from "memfs";
import { createReadTool } from "../../src/agent/tools/read";
import type { ReadDirent, ReadFs } from "../../src/agent/tools/read/fs";
import { Scenario } from "../harness/scenario";
import { scriptTextReply, scriptToolCallTurn } from "./scripting";

const toReadFs = (volume: InstanceType<typeof Volume>): ReadFs => ({
  open: (path, flags) => volume.promises.open(path, flags),
  stat: (path) => volume.promises.stat(path),
  // memfs types readdir as TDataOut[] | IDirent[] even with
  // withFileTypes: true; at runtime it always returns dirents.
  readdir: (path, options) =>
    volume.promises.readdir(path, options) as Promise<ReadDirent[]>,
});

export const readTurn = async (
  files: Record<string, string>,
  input: JsonValue,
): Promise<Scenario> => {
  const volume = Volume.fromJSON(files);
  const scenario = new Scenario();
  scenario.withTools([createReadTool({ fs: toReadFs(volume) })]);
  scriptToolCallTurn(scenario, [
    { toolCallId: "call-1", toolName: "read", input },
  ]);
  scriptTextReply(scenario, "Done");
  await scenario.sendMessage("Read it");
  return scenario;
};
