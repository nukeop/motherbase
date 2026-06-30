import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../utils";
import { components } from "./markdown-components";

type MarkdownProps = {
  children: string;
  className?: string;
};

export const Markdown = ({ children, className }: MarkdownProps) => {
  return (
    <div className={cn("flex flex-col gap-3 font-body text-ink", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};
