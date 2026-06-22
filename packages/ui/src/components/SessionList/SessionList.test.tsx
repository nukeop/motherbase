import { describe, expect, test } from "bun:test";
import { render } from "bun-test-env-dom";
import { SessionList } from "./SessionList";

const sessions = [
  { id: "1", title: "The Ultimate Hamburger" },
  { id: "2", title: "Skull Face's Objective" },
  { id: "3", title: "Code Talker and His Research" },
];

describe("SessionList", () => {
  test("renders a list of sessions", () => {
    const { container } = render(
      <SessionList sessions={sessions} onSelect={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders with a selected session", () => {
    const { container } = render(
      <SessionList sessions={sessions} selectedId="2" onSelect={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });

  test("renders empty state", () => {
    const { container } = render(
      <SessionList sessions={[]} onSelect={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });
});
