import type { MessagePart } from "@motherbase/core";
import type { FC } from "react";
import { CornerAccent } from "./CornerAccent";

type UserMessageProps = {
  parts: MessagePart[];
};

export const UserMessage: FC<UserMessageProps> = ({ parts }) => (
  <div className="relative bg-cream-dark border border-steel/30 border-l-4 border-l-ink px-5 py-4">
    {parts
      .filter((part) => part.type === "text")
      .map((part) => (
        <p key={part.text} className="font-body leading-relaxed text-ink">
          {part.text}
        </p>
      ))}
    <CornerAccent position="bottom-right" />
  </div>
);
