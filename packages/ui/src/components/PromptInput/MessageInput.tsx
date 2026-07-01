import { type KeyboardEvent, useState } from "react";

type MessageInputProps = {
  onSubmit?: (text: string) => void;
};

export const MessageInput = ({ onSubmit }: MessageInputProps) => {
  const [text, setText] = useState("");

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    const trimmed = text.trim();
    if (trimmed && onSubmit) {
      onSubmit(trimmed);
      setText("");
    }
  };

  return (
    <textarea
      rows={1}
      placeholder="Send a message..."
      value={text}
      onChange={(event) => setText(event.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full resize-none bg-transparent px-4 py-3 font-body text-sm text-cream placeholder:text-cream/30 outline-none"
    />
  );
};
