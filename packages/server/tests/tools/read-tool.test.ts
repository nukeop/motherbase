import { describe, expect, it } from "bun:test";
import { dedent } from "../utils/dedent";
import { readTurn } from "../utils/read-turn";

describe("read tool", () => {
  describe("reading files", () => {
    it("returns numbered lines with an end-of-file footer", async () => {
      const scenario = await readTurn(
        { "/project/notes.txt": "first\nsecond\nthird\n" },
        { filePath: "/project/notes.txt" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: dedent`
          <path>/project/notes.txt</path>
          <type>file</type>
          <content>
          1: first
          2: second
          3: third
          (End of file - total 3 lines)
          </content>
        `,
      });
    });

    it.todo("returns lines from offset up to limit with a continuation footer", () => {});
    it.todo("caps output at 500 lines when no limit is given", () => {});
    it.todo("reports end-of-file when the limit lands exactly on the last line", () => {});
    it.todo("truncates lines longer than 2000 characters", () => {});
    it.todo("stops at the 50 KiB output cap with a byte-cap footer", () => {});
  });

  describe("listing directories", () => {
    it.todo("lists entries sorted, with trailing slashes on subdirectories", () => {});
    it.todo("pages entries with offset and limit", () => {});
  });

  describe("errors", () => {
    it.todo("rejects a relative path", () => {});
    it.todo("reports a missing file with did-you-mean suggestions", () => {});
    it.todo("reports a missing file plainly when nothing similar exists", () => {});
    it.todo("rejects an offset past the end of the file", () => {});
    it.todo("rejects a binary file", () => {});
    it.todo("completes the turn normally after a read error", () => {});
  });
});
