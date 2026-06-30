import { Markdown } from "../Markdown";

type TextPartProps = {
  text: string;
};

export const TextPart = ({ text }: TextPartProps) => {
  return <Markdown>{text}</Markdown>;
};
