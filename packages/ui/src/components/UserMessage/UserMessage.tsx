import { CornerAccent } from "./CornerAccent";

type UserMessageProps = {
  text: string;
};

export const UserMessage = ({ text }: UserMessageProps) => (
  <div className="relative bg-cream-dark border border-steel/30 border-l-4 border-l-ink px-5 py-4">
    <p className="font-body leading-relaxed text-ink">{text}</p>
    <CornerAccent position="bottom-right" />
  </div>
);
