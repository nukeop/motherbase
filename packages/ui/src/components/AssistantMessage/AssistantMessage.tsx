import { ReasoningPart } from "./ReasoningPart";
import { TextPart } from "./TextPart";
import { ToolCallBlock } from "./ToolCallBlock";

type MessagePart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string }
  | {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      input: unknown;
    };

type AssistantMessageProps = {
  parts: MessagePart[];
};

export const AssistantMessage = ({ parts }: AssistantMessageProps) => {
  return (
    <div className="flex flex-col gap-4 font-body text-sm text-ink">
      {parts.map((part, index) => {
        const key = `${part.type}-${index}`;
        if (part.type === "reasoning") {
          return (
            <ReasoningPart
              key={key}
              text={part.text}
              isLast={index === parts.length - 1}
            />
          );
        }
        if (part.type === "text") {
          return <TextPart key={key} text={part.text} />;
        }
        if (part.type === "tool-call") {
          return (
            <ToolCallBlock
              key={key}
              toolName={part.toolName}
              input={part.input}
            />
          );
        }
        return null;
      })}
    </div>
  );
};
