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

      const numbered = lines.slice(0, 51).map((line, i) => `${i + 1}: ${line}`);

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
    it("lists entries sorted, with trailing slashes on subdirectories", async () => {
      const scenario = await readTurn(
        {
          "/project/package.json": "{}",
          "/project/README.md": "docs",
          "/project/src/index.ts": "",
        },
        { filePath: "/project" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: dedent`
          <path>/project</path>
          <type>directory</type>
          <content>
          README.md
          package.json
          src/
          (Directory - total 3 entries)
          </content>
        `,
      });
    });

    it("pages entries with offset and limit", async () => {
      const scenario = await readTurn(
        {
          "/project/a.txt": "",
          "/project/b.txt": "",
          "/project/c.txt": "",
          "/project/d.txt": "",
        },
        { filePath: "/project", offset: 2, limit: 2 },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "success",
        output: dedent`
          <path>/project</path>
          <type>directory</type>
          <content>
          b.txt
          c.txt
          (Showing entries 2-3 of 4. Use offset=4 to continue.)
          </content>
        `,
      });
    });
  });

  describe("errors", () => {
    it("rejects a relative path", async () => {
      const scenario = await readTurn(
        { "/project/notes.txt": "first\n" },
        { filePath: "src/notes.txt" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "error",
        output: "Path must be absolute: src/notes.txt",
      });
    });

    it("reports a missing file with did-you-mean suggestions", async () => {
      const scenario = await readTurn(
        {
          "/project/notes.txt": "",
          "/project/notes1.txt": "",
          "/project/notes2.txt": "",
          "/project/notes3.txt": "",
          "/project/other.md": "",
        },
        { filePath: "/project/NOTES" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "error",
        output: dedent`
          File not found: /project/NOTES
          Did you mean one of these?
          - notes.txt
          - notes1.txt
          - notes2.txt
        `,
      });
    });

    it("reports a missing file plainly when nothing similar exists", async () => {
      const scenario = await readTurn(
        { "/project/readme.md": "docs" },
        { filePath: "/project/config.json" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "error",
        output: "File not found: /project/config.json",
      });
    });

    it("rejects an offset past the end of the file", async () => {
      const scenario = await readTurn(
        { "/project/notes.txt": "first\nsecond\nthird\n" },
        { filePath: "/project/notes.txt", offset: 10 },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "error",
        output: "Offset 10 is out of range (3 lines)",
      });
    });

    it("rejects a binary file", async () => {
      const scenario = await readTurn(
        { "/project/blob.bin": "PK\u0003\u0004\u0000payload" },
        { filePath: "/project/blob.bin" },
      );

      expect(scenario.messages[2]).toEqual({
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "read",
        outcome: "error",
        output: "Cannot read binary file: /project/blob.bin",
      });
    });

    it("completes the turn normally after a read error", async () => {
      const scenario = await readTurn(
        { "/project/notes.txt": "first\n" },
        { filePath: "src/notes.txt" },
      );

      const result = scenario.messages[2] as { outcome: string };
      expect(result.outcome).toBe("error");
      expect(scenario.messages[3]).toEqual({
        kind: "message",
        role: "assistant",
        parts: [{ type: "text", text: "Done" }],
      });
      expect(scenario.events.at(-1)).toEqual({ type: "turn-completed" });
      expect(scenario.events.some((event) => event.type === "error")).toBe(
        false,
      );
    });
  });
});
