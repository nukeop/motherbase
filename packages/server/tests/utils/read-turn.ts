import type { JsonValue } from "@motherbase/core";
import { Volume } from "memfs";
import { createReadTool } from "../../src/agent/tools/read";
import { Scenario } from "../harness/scenario";
import { scriptTextReply, scriptToolCallTurn } from "./scripting";

export const readTurn = async (
  files: Record<string, string>,
  input: JsonValue,
): Promise<Scenario> => {
  const volume = Volume.fromJSON(files);
  const scenario = new Scenario();
  scenario.withTools([createReadTool({ fs: volume.promises })]);
  scriptToolCallTurn(scenario, [
    { toolCallId: "call-1", toolName: "read", input },
  ]);
  scriptTextReply(scenario, "Done");
  await scenario.sendMessage("Read it");
  return scenario;
};
