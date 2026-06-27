type ReasoningPartProps = {
  text: string;
};

export const ReasoningPart = ({ text }: ReasoningPartProps) => {
  return <div className="text-blue">{text}</div>;
};
