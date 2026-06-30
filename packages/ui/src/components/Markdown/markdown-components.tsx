import type { Components } from "react-markdown";
import { CodeBlock } from "./CodeBlock";

export const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-body text-2xl font-bold text-ink">{children}</h1>
  ),

  h2: ({ children }) => (
    <h2 className="font-body text-xl font-bold text-ink">{children}</h2>
  ),

  h3: ({ children }) => (
    <h3 className="font-body text-lg font-semibold text-ink">{children}</h3>
  ),

  h4: ({ children }) => (
    <h4 className="font-body text-base font-semibold text-ink">{children}</h4>
  ),

  p: ({ children }) => (
    <p className="font-body text-sm leading-relaxed text-ink">{children}</p>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-5 font-body text-sm text-ink">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-5 font-body text-sm text-ink">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-steel pl-4 text-steel">
      {children}
    </blockquote>
  ),

  code: ({ children, className }) => {
    const language = /^language-(\w+)$/.exec(className ?? "")?.[1];
    if (language) {
      return (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          language={language}
        />
      );
    }
    return (
      <code className="rounded border border-steel/20 bg-cream px-1 py-0.5 font-mono text-xs">
        {children}
      </code>
    );
  },

  pre: ({ children }) => (
    <pre className="whitespace-pre-wrap wrap-break-word rounded bg-gunmetal px-4 py-3 font-mono text-xs text-cream [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-steel text-sm">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border border-steel bg-cream px-3 py-2 text-left font-semibold text-ink">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border border-steel px-3 py-2 text-ink">{children}</td>
  ),

  tr: ({ children }) => (
    <tr className="even:bg-cream/60">{children}</tr>
  ),

  hr: () => <hr className="border-steel" />,

  strong: ({ children }) => (
    <strong className="font-bold">{children}</strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="max-w-full rounded" />
  ),
};
