import type { Components } from "react-markdown";
import { CodeBlock } from "./CodeBlock";

export const components: Components = {
  h1: ({ children }) => (
    <h1 className="flex items-center gap-3.5 mb-4">
      <span className="w-1.5 h-8 bg-blue shrink-0 block" />
      <span className="font-nav font-bold text-4xl uppercase tracking-tight text-ink leading-none">
        {children}
      </span>
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="flex items-center gap-3 mt-8 mb-3.5">
      <span className="w-1 h-5 bg-blue shrink-0 block" />
      <span className="font-nav font-semibold text-2xl uppercase tracking-wide text-ink leading-none">
        {children}
      </span>
      <span className="flex-1 h-px bg-steel/15 block" />
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="flex items-center gap-2 mt-6 mb-3">
      <span className="size-1.5 bg-blue shrink-0 block" />
      <span className="font-mono font-semibold text-xs uppercase tracking-widest text-steel">
        {children}
      </span>
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="font-mono text-xs uppercase tracking-widest text-steel/70 mt-4 mb-2">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="font-body text-base leading-relaxed text-ink">{children}</p>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue underline decoration-blue/45 underline-offset-4 decoration-1"
    >
      {children}
      <span className="text-xs text-blue align-super ml-px">↗</span>
    </a>
  ),

  ul: ({ children }) => (
    <ul className="flex flex-col gap-2.5 font-body text-base text-ink [&>li]:grid [&>li]:grid-cols-[auto_1fr] [&>li]:gap-x-3 [&>li]:gap-y-1 [&>li]:items-baseline [&>li>*]:col-start-2 [&>li]:before:content-[''] [&>li]:before:size-1.5 [&>li]:before:bg-steel [&>li]:before:translate-y-px [&>li]:before:block">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="flex flex-col gap-3 font-body text-base text-ink [counter-reset:item] [&>li]:grid [&>li]:grid-cols-[auto_1fr] [&>li]:gap-x-3.5 [&>li]:gap-y-1 [&>li]:items-baseline [&>li>*]:col-start-2 [&>li]:before:content-[counter(item,decimal-leading-zero)] [&>li]:before:font-mono [&>li]:before:text-sm [&>li]:before:font-semibold [&>li]:before:text-blue [&>li]:[counter-increment:item]">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-orange bg-steel/5 px-4 py-3 [&_p]:text-steel">
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
      <code className="font-mono text-sm bg-steel/5 border border-steel/15 px-1.5 py-px rounded-sm text-gunmetal">
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
    <div className="overflow-x-auto border border-steel/30">
      <table className="w-full border-collapse font-mono text-xs">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="text-left px-3.5 py-2.5 font-semibold text-xs uppercase tracking-widest text-steel border-b border-steel/30 bg-steel/5">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-3.5 py-2.5 text-ink border-b border-steel/15">
      {children}
    </td>
  ),

  tr: ({ children }) => <tr className="even:bg-steel/5">{children}</tr>,

  hr: () => <hr className="border-steel/20 my-8" />,

  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  del: ({ children }) => (
    <del className="line-through text-steel/80">{children}</del>
  ),

  img: ({ src, alt }) => (
    <figure>
      <div
        className="relative border border-steel/30 flex items-center justify-center p-6 bg-cream-dark"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in oklch, var(--color-steel) 15%, transparent) 0px, color-mix(in oklch, var(--color-steel) 15%, transparent) 1px, transparent 1px, transparent 10px)",
        }}
      >
        <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-steel" />
        <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-steel" />
        <img src={src} alt={alt} className="relative max-w-full block" />
      </div>
      {alt && (
        <figcaption className="font-mono text-xs text-steel/80 mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
};
