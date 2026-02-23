import { useMemo } from 'react';

/**
 * Lightweight markdown renderer for exercise instructions.
 * Handles: inline `code`, fenced ```code blocks```, **bold**, paragraphs,
 * and indented example sections. Code blocks get JS/CSS syntax highlighting.
 */

// ─── Syntax Highlighting ────────────────────────────────────────────────────

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends',
  'import', 'export', 'default', 'from', 'of', 'in', 'typeof', 'instanceof',
  'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'true', 'false',
  'null', 'undefined', 'void', 'delete', 'super', 'static', 'get', 'set',
]);

interface Token {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'method' | 'property' | 'bracket' | 'text';
  text: string;
}

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = [];
  // Regex matches: strings, single-line comments, multi-line comments, numbers,
  // .method(), identifiers, brackets, everything else
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(\b\d+\.?\d*\b)|(\.(\w+)\s*\()|(\.(\w+))|\b(\w+)\b|([()[\]{}<>])|(\S)/g;
  let m: RegExpExecArray | null;
  let lastIdx = 0;

  while ((m = re.exec(code)) !== null) {
    if (m.index > lastIdx) {
      tokens.push({ type: 'text', text: code.slice(lastIdx, m.index) });
    }
    lastIdx = m.index + m[0].length;

    if (m[1]) {
      tokens.push({ type: 'string', text: m[0] });
    } else if (m[2] || m[3]) {
      tokens.push({ type: 'comment', text: m[0] });
    } else if (m[4]) {
      tokens.push({ type: 'number', text: m[0] });
    } else if (m[5]) {
      // .method() — dot + method + paren
      tokens.push({ type: 'text', text: '.' });
      tokens.push({ type: 'method', text: m[6] });
      tokens.push({ type: 'bracket', text: '(' });
    } else if (m[7]) {
      // .property (no paren)
      tokens.push({ type: 'text', text: '.' });
      tokens.push({ type: 'property', text: m[8] });
    } else if (m[9]) {
      const word = m[9];
      if (JS_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else {
        tokens.push({ type: 'text', text: word });
      }
    } else if (m[10]) {
      tokens.push({ type: 'bracket', text: m[0] });
    } else {
      tokens.push({ type: 'text', text: m[0] });
    }
  }

  if (lastIdx < code.length) {
    tokens.push({ type: 'text', text: code.slice(lastIdx) });
  }

  return tokens;
}

/**
 * Tokenize a single example line, splitting at the → arrow.
 * Left of → is JS code (syntax highlighted). Right of → is the expected
 * result annotation, rendered as a comment-styled token so descriptions
 * like "(can't afford anything)" and keywords like true/false don't get
 * incorrectly highlighted.
 */
function tokenizeExample(line: string): Token[] {
  const arrowIdx = line.indexOf('→');
  if (arrowIdx === -1) {
    return tokenizeJS(line);
  }

  const codePart = line.slice(0, arrowIdx);
  const resultPart = line.slice(arrowIdx); // includes → and everything after

  const tokens = tokenizeJS(codePart);
  tokens.push({ type: 'comment', text: resultPart });
  return tokens;
}

function HighlightedCode({ code, language: _language }: { code: string; language?: string }) {
  const tokens = useMemo(() => tokenizeJS(code), [code]);

  return (
    <code>
      {tokens.map((tok, i) => (
        <span
          key={i}
          className="hltoken"
          data-type={tok.type}
          style={{ color: `var(--hl-${tok.type})` }}
        >
          {tok.text}
        </span>
      ))}
    </code>
  );
}

function HighlightedExample({ code }: { code: string }) {
  const tokens = useMemo(() => {
    return code.split('\n').flatMap((line, i, arr) => {
      const lineTokens = tokenizeExample(line);
      if (i < arr.length - 1) lineTokens.push({ type: 'text', text: '\n' });
      return lineTokens;
    });
  }, [code]);

  return (
    <code>
      {tokens.map((tok, i) => (
        <span
          key={i}
          className="hltoken"
          data-type={tok.type}
          style={{ color: `var(--hl-${tok.type})` }}
        >
          {tok.text}
        </span>
      ))}
    </code>
  );
}

// ─── Inline Parsing ─────────────────────────────────────────────────────────

interface InlineNode {
  type: 'text' | 'code' | 'bold';
  text: string;
}

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  // Match: `code`, **bold**
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) {
      nodes.push({ type: 'text', text: text.slice(lastIdx, m.index) });
    }
    lastIdx = m.index + m[0].length;

    if (m[1]) {
      nodes.push({ type: 'code', text: m[1].slice(1, -1) });
    } else if (m[2]) {
      nodes.push({ type: 'bold', text: m[2].slice(2, -2) });
    }
  }

  if (lastIdx < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIdx) });
  }

  return nodes;
}

function InlineContent({ text }: { text: string }) {
  const nodes = useMemo(() => parseInline(text), [text]);

  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === 'code') {
          return (
            <code
              key={i}
              className="inline-code"
              style={{
                backgroundColor: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                padding: '1px 5px',
                fontSize: '0.85em',
                fontFamily: 'Source Code Pro, monospace',
                color: 'var(--accent)',
              }}
            >
              {node.text}
            </code>
          );
        }
        if (node.type === 'bold') {
          return (
            <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {node.text}
            </strong>
          );
        }
        return <span key={i}>{node.text}</span>;
      })}
    </>
  );
}

// ─── Block Parsing ──────────────────────────────────────────────────────────

interface Block {
  type: 'paragraph' | 'code-block' | 'example-block';
  content: string;
  language?: string;
}

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block: ```lang ... ```
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'js';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code-block', content: codeLines.join('\n'), language: lang });
      continue;
    }

    // Indented example block: lines starting with 2+ spaces that look like code
    // (function calls, arrow notation, etc.)
    if (/^  \S/.test(line) && (line.includes('→') || line.includes('(') || line.includes('//') || /^\s+\w+\(/.test(line))) {
      const exLines: string[] = [line];
      i++;
      while (i < lines.length && (/^  \S/.test(lines[i]) || lines[i].trim() === '')) {
        if (lines[i].trim() === '' && i + 1 < lines.length && !/^  \S/.test(lines[i + 1])) break;
        exLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'example-block', content: exLines.join('\n') });
      continue;
    }

    // Empty line — skip (paragraph separator)
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph — collect consecutive non-empty, non-special lines
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !(/^  \S/.test(lines[i]) && (lines[i].includes('→') || lines[i].includes('(')))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
  }

  return blocks;
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface MarkdownLiteProps {
  text: string;
  className?: string;
}

export default function MarkdownLite({ text, className }: MarkdownLiteProps) {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <style>{`
        :root, .dark {
          --hl-keyword: #c678dd;
          --hl-string: #98c379;
          --hl-number: #d19a66;
          --hl-comment: #5c6370;
          --hl-method: #61afef;
          --hl-property: #e5c07b;
          --hl-bracket: #abb2bf;
          --hl-text: #abb2bf;
        }
        .light {
          --hl-keyword: #7c3aed;
          --hl-string: #16a34a;
          --hl-number: #c2410c;
          --hl-comment: #6b7280;
          --hl-method: #2563eb;
          --hl-property: #a16207;
          --hl-bracket: #374151;
          --hl-text: #374151;
        }
        .high-contrast {
          --hl-keyword: #d8b4fe;
          --hl-string: #6ee7b7;
          --hl-number: #fdba74;
          --hl-comment: #9ca3af;
          --hl-method: #93c5fd;
          --hl-property: #fde68a;
          --hl-bracket: #e5e7eb;
          --hl-text: #f3f4f6;
        }
      `}</style>
      {blocks.map((block, i) => {
        if (block.type === 'code-block') {
          return (
            <pre
              key={i}
              className="text-xs font-code overflow-x-auto"
              style={{
                backgroundColor: 'var(--bg-editor, var(--bg-raised))',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 12px',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <HighlightedCode code={block.content} language={block.language} />
            </pre>
          );
        }

        if (block.type === 'example-block') {
          return (
            <pre
              key={i}
              className="text-xs font-code overflow-x-auto"
              style={{
                backgroundColor: 'var(--bg-editor, var(--bg-raised))',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 12px',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <HighlightedExample code={block.content} />
            </pre>
          );
        }

        // Paragraph
        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-primary)', margin: 0 }}
          >
            <InlineContent text={block.content} />
          </p>
        );
      })}
    </div>
  );
}
