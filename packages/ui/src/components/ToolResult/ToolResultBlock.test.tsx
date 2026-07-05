import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { ToolResultBlock } from "./ToolResultBlock";

describe("ToolResultBlock", () => {
  test("renders a success result as a JSON dump", () => {
    const { container } = render(
      <ToolResultBlock
        toolName="echo"
        outcome="success"
        output={{ echoed: "ping" }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("delegates an error result to ToolErrorBlock", () => {
    const { container } = render(
      <ToolResultBlock
        toolName="echo"
        outcome="error"
        output="some tool error"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("delegates a crash result to ToolErrorBlock", () => {
    const { container } = render(
      <ToolResultBlock
        toolName="echo"
        outcome="crash"
        output="some tool crash"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
