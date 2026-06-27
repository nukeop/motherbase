import { ReasoningPart } from "./ReasoningPart";
import { TextPart } from "./TextPart";

type MessagePart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string };

type AssistantMessageProps = {
  parts: MessagePart[];
};

export const AssistantMessage = ({ parts }: AssistantMessageProps) => {
  return (
    <div className="border-r-2 border-orange bg-cream px-4 py-3 font-body text-sm text-ink">
      {parts.map((part, index) => {
        const key = `${part.type}-${index}`;
        if (part.type === "reasoning") {
          return <ReasoningPart key={key} text={part.text} />;
        }
        return <TextPart key={key} text={part.text} />;
      })}
    </div>
  );
};
