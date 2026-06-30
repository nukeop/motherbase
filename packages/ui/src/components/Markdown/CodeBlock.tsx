import { Fragment } from "react";
import type { BundledLanguage } from "shiki";
import { THEME } from "./highlighter";
import { useHighlighter } from "./use-highlighter";

type CodeBlockProps = {
  code: string;
  language: string;
};

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const highlighter = useHighlighter();

  if (!highlighter?.getLoadedLanguages().includes(language)) {
    return <code>{code}</code>;
  }

  const { tokens } = highlighter.codeToTokens(code, {
    theme: THEME,
    lang: language as BundledLanguage,
  });

  return (
    <code>
      {tokens.map((line, lineIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: go away
        <Fragment key={lineIndex}>
          <span>
            {line.map((token, tokenIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: go away
              <span key={tokenIndex} style={{ color: token.color }}>
                {token.content}
              </span>
            ))}
          </span>
          {lineIndex < tokens.length - 1 && "\n"}
        </Fragment>
      ))}
    </code>
  );
};
