import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { ReadToolResult } from "./ReadToolResult";

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
        output="Offset 999 is out of range (12 lines)"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
