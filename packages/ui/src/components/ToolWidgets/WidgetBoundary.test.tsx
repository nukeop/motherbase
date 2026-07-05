import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { WidgetBoundary } from "./WidgetBoundary";

describe("WidgetBoundary", () => {
  test("renders the fallback when the child throws", () => {
    const Bomb = () => {
      throw new Error("widget blew up");
    };
    const { container } = render(
      <WidgetBoundary fallback={<div>generic fallback</div>}>
        <Bomb />
      </WidgetBoundary>,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders the child when it does not throw", () => {
    const { container } = render(
      <WidgetBoundary fallback={<div>generic fallback</div>}>
        <div>the widget</div>
      </WidgetBoundary>,
    );
    expect(container).toMatchSnapshot();
  });
});
