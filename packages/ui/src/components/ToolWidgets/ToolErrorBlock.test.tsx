import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
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
