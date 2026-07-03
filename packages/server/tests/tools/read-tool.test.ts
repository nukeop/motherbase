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

    it("returns lines from offset up to limit with a continuation footer", async () => {
      const scenario = await readTurn(
        { "/project/long.txt": "l1\nl2\nl3\nl4\nl5\nl6\nl7\nl8\nl9\nl10\n" },
        { filePath: "/project/long.txt", offset: 3, limit: 4 },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: dedent`
          <path>/project/long.txt</path>
          <type>file</type>
          <content>
          3: l3
          4: l4
          5: l5
          6: l6
          (Showing lines 3-6. More lines exist. Use offset=7 to continue.)
          </content>
        `,
      });
    });

    it("caps output at 500 lines when no limit is given", async () => {
      const lines = Array.from({ length: 501 }, (_, i) => `line ${i + 1}`);
      const scenario = await readTurn(
        { "/project/big.txt": `${lines.join("\n")}\n` },
        { filePath: "/project/big.txt" },
      );

      const numbered = lines
        .slice(0, 500)
        .map((line, i) => `${i + 1}: ${line}`);

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: [
          "<path>/project/big.txt</path>",
          "<type>file</type>",
          "<content>",
          ...numbered,
          "(Showing lines 1-500. More lines exist. Use offset=501 to continue.)",
          "</content>",
        ].join("\n"),
      });
    });

    it("reports end-of-file when the limit lands exactly on the last line", async () => {
      const scenario = await readTurn(
        { "/project/notes.txt": "first\nsecond\nthird\n" },
        { filePath: "/project/notes.txt", limit: 3 },
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

    it("truncates lines longer than 2000 characters", async () => {
      const scenario = await readTurn(
        { "/project/wide.txt": `short\n${"x".repeat(2500)}\nend\n` },
        { filePath: "/project/wide.txt" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: dedent`
          <path>/project/wide.txt</path>
          <type>file</type>
          <content>
          1: short
          2: ${"x".repeat(2000)}... (line truncated)
          3: end
          (End of file - total 3 lines)
          </content>
        `,
      });
    });

    it("stops at the 50 KiB output cap with a byte-cap footer", async () => {
      const lines = Array.from({ length: 60 }, () => "a".repeat(1000));
      const scenario = await readTurn(
        { "/project/heavy.txt": `${lines.join("\n")}\n` },
        { filePath: "/project/heavy.txt" },
      );

      const numbered = lines
        .slice(0, 51)
        .map((line, i) => `${i + 1}: ${line}`);

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: [
          "<path>/project/heavy.txt</path>",
          "<type>file</type>",
          "<content>",
          ...numbered,
          "(Output capped at 50 KB. Showing lines 1-51. Use offset=52 to continue.)",
          "</content>",
        ].join("\n"),
      });
    });
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
