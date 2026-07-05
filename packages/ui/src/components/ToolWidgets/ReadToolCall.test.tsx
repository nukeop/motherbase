import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { ReadToolCall } from "./ReadToolCall";

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
