type UserMessageProps = {
  text: string;
};

export const UserMessage = ({ text }: UserMessageProps) => {
  return (
    <div className="border-l-2 border-blue bg-cream px-4 py-3 font-body text-sm font-bold text-ink">
      {text}
    </div>
  );
};
