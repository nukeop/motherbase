import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { ReadToolCall } from "./ReadToolCall";
import { ReadToolResult } from "./ReadToolResult";
import { ToolErrorBlock } from "./ToolErrorBlock";

const notFoundFixture =
  "File not found: /projects/app/NOTES\nDid you mean one of these?\n- notes.txt";

describe("ToolErrorBlock", () => {
  test("renders a tool error with the error header", () => {
    const { container } = render(
      <ToolErrorBlock outcome="error" output={notFoundFixture} />,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders a crash with the crashed header", () => {
    const { container } = render(
      <ToolErrorBlock
        outcome="crash"
        output="they played us like a damn fiddle!"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

describe("ReadToolCall", () => {
  test("renders the path with basename emphasized", () => {
    const { container } = render(
      <ReadToolCall
        toolName="read"
        input={{ filePath: "/projects/app/src/notes.txt" }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders an offset/limit range suffix", () => {
    const { container } = render(
      <ReadToolCall
        toolName="read"
        input={{ filePath: "/a/b.txt", offset: 100, limit: 200 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders offset-only input without a range suffix", () => {
    const { container } = render(
      <ReadToolCall
        toolName="read"
        input={{ filePath: "/a/b.txt", offset: 100 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

describe("ReadToolResult", () => {
  test("renders nothing on success", () => {
    const { container } = render(
      <ReadToolResult
        toolName="read"
        outcome="success"
        output="<path>/a/b.txt</path>"
      />,
    );
    expect(container.innerHTML).toEqual("");
  });

  test("renders ToolErrorBlock on error", () => {
    const { container } = render(
      <ReadToolResult
        toolName="read"
        outcome="error"
        output={notFoundFixture}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
