import { describe, it } from "bun:test";
import type { JsonValue } from "@motherbase/core";
import { Volume } from "memfs";
import { createReadTool } from "../src/agent/tools/read";
import { Scenario } from "./helpers/scenario";
import { scriptTextReply, scriptToolCallTurn } from "./helpers/tool-fixtures";

const readTurn = async (
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

describe("read tool", () => {
  describe("reading files", () => {
    it.todo("returns numbered lines with an end-of-file footer");
    it.todo(
      "returns lines from offset up to limit with a continuation footer",
    );
    it.todo("caps output at 500 lines when no limit is given");
    it.todo(
      "reports end-of-file when the limit lands exactly on the last line",
    );
    it.todo("truncates lines longer than 2000 characters");
    it.todo("stops at the 50 KiB output cap with a byte-cap footer");
  });

  describe("listing directories", () => {
    it.todo(
      "lists entries sorted, with trailing slashes on subdirectories",
    );
    it.todo("pages entries with offset and limit");
  });

  describe("errors", () => {
    it.todo("rejects a relative path");
    it.todo("reports a missing file with did-you-mean suggestions");
    it.todo(
      "reports a missing file plainly when nothing similar exists",
    );
    it.todo("rejects an offset past the end of the file");
    it.todo("rejects a binary file");
    it.todo("completes the turn normally after a read error");
  });
});
