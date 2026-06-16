import type { ReactNode } from "react";

type ConversationProps = {
  children: ReactNode;
};

export const Conversation = ({ children }: ConversationProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {children}
    </div>
  );
};
