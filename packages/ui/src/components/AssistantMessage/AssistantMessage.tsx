type AssistantMessageProps = {
  text: string;
};

export const AssistantMessage = ({ text }: AssistantMessageProps) => {
  return (
    <div className="border-r-2 border-orange bg-cream px-4 py-3 font-body text-sm text-ink">
      {text}
    </div>
  );
};
