import React, { useState } from 'react';

interface RichMessageRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const RichMessageRenderer: React.FC<RichMessageRendererProps> = ({
  content,
  isStreaming = false,
}) => {
  return (
    <div className="rich-message-content space-y-3.5 text-on-surface font-body-md text-body-md leading-relaxed break-words">
      {parseMarkdownBlocks(content)}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle" />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Markdown Block Parser
// ─────────────────────────────────────────────────────────

function parseMarkdownBlocks(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block (```lang)
    if (line.trim().startsWith('```')) {
      const match = line.trim().match(/^```([a-zA-Z0-9_-]*)/);
      const language = match ? match[1] || 'plaintext' : 'plaintext';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <CodeBlock
          key={`code-${blockKey++}`}
          code={codeLines.join('\n')}
          language={language}
        />
      );
      continue;
    }

    // 2. Table Block (| Header | Header |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      nodes.push(<TableBlock key={`table-${blockKey++}`} lines={tableLines} />);
      continue;
    }

    // 3. Display Math Block ($$ ... $$)
    if (line.trim().startsWith('$$')) {
      const mathLines: string[] = [];
      if (line.trim().endsWith('$$') && line.trim().length > 2) {
        mathLines.push(line.trim().slice(2, -2).trim());
        i++;
      } else {
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('$$')) {
          mathLines.push(lines[i]);
          i++;
        }
        i++;
      }
      nodes.push(
        <div
          key={`math-${blockKey++}`}
          className="my-3 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center font-code-md text-code-md text-primary tracking-wide overflow-x-auto shadow-xs"
        >
          {mathLines.join('\n')}
        </div>
      );
      continue;
    }

    // 4. Headings (# , ## , ### )
    if (line.startsWith('### ')) {
      nodes.push(
        <h4
          key={`h3-${blockKey++}`}
          className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-3 pb-1 flex items-center gap-2 border-b border-outline-variant/20"
        >
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>{renderInline(line.slice(4))}</span>
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      nodes.push(
        <h3
          key={`h2-${blockKey++}`}
          className="font-headline-md text-headline-md text-on-surface font-semibold pt-4 pb-1.5 flex items-center gap-2 border-b border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
          <span>{renderInline(line.slice(3))}</span>
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      nodes.push(
        <h2
          key={`h1-${blockKey++}`}
          className="font-headline-lg text-headline-lg text-on-surface font-bold pt-4 pb-2 border-b border-primary/20"
        >
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // 5. Blockquote (> )
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote
          key={`quote-${blockKey++}`}
          className="border-l-4 border-primary pl-4 py-1.5 my-2 italic text-on-surface-variant bg-surface-container-low/60 rounded-r-lg font-body-md"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx}>{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 6. Numbered Lists (1. , 2. )
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${blockKey++}`} className="space-y-2 my-2 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-code-sm text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                {idx + 1}
              </span>
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Bullet Lists (- , * )
    if (/^[-*]\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s*/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${blockKey++}`} className="space-y-1.5 my-2 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Normal Paragraph or Empty Line
    if (line.trim().length === 0) {
      i++;
      continue;
    }

    // Collect consecutive paragraph lines
    const paragraphLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('> ') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^[-*]\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('$$')
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    nodes.push(
      <p key={`p-${blockKey++}`} className="font-body-md leading-relaxed text-on-surface">
        {renderInline(paragraphLines.join(' '))}
      </p>
    );
  }

  return nodes;
}

// ─────────────────────────────────────────────────────────
// Inline Markdown & KaTeX Formatter
// ─────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  // Split by inline code `...`, bold **...**, inline math $...$, and links [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\$[^$]+\$|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-surface-container-high text-primary font-code-sm text-[12px] font-medium border border-outline-variant/30"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-on-surface">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-on-surface-variant">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Math: $math$
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      return (
        <span
          key={index}
          className="font-code-sm text-primary font-medium px-1 py-0.5 mx-0.5 bg-surface-container-low rounded border border-primary/20"
        >
          {part.slice(1, -1)}
        </span>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-container font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

// ─────────────────────────────────────────────────────────
// Code Block Component with 1-Click Copy
// ─────────────────────────────────────────────────────────

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-xl overflow-hidden border border-outline-variant/30 bg-[#1e1e24] shadow-sm text-surface-container-lowest">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#16161a] border-b border-white/10 text-[12px] font-code-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 uppercase tracking-wider text-outline text-[11px] font-bold">
            {language || 'code'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all text-[11px] font-medium"
          title="Copy code to clipboard"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Code Content Area */}
      <pre className="p-4 overflow-x-auto font-code-sm text-[13px] leading-relaxed text-[#f0f0f5]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Table Block Component
// ─────────────────────────────────────────────────────────

function TableBlock({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null;

  const headerRow = parseTableRow(lines[0]);
  const hasDivider = lines[1].includes('---');
  const dataRows = lines.slice(hasDivider ? 2 : 1).map(parseTableRow);

  return (
    <div className="my-3.5 overflow-x-auto rounded-xl border border-outline-variant/30 shadow-xs">
      <table className="w-full text-left font-body-sm text-body-sm border-collapse">
        <thead className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface font-semibold">
          <tr>
            {headerRow.map((col, idx) => (
              <th key={idx} className="p-3 font-label-md text-label-md">
                {renderInline(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
          {dataRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`hover:bg-surface-container-low transition-colors ${
                rIdx % 2 === 1 ? 'bg-surface-container-low/30' : ''
              }`}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 text-on-surface">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());
}
