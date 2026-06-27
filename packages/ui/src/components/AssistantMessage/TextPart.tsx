type TextPartProps = {
  text: string;
};

export const TextPart = ({ text }: TextPartProps) => {
  return <div>{text}</div>;
};
