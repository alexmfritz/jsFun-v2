import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownLite from '../../src/components/shared/MarkdownLite';

describe('MarkdownLite', () => {
  it('renders plain text as a paragraph', () => {
    render(<MarkdownLite text="Hello world" />);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('renders inline code with <code> elements', () => {
    const { container } = render(<MarkdownLite text="Use `console.log` to debug" />);
    const codeEl = container.querySelector('code.inline-code');
    expect(codeEl).toBeTruthy();
    expect(codeEl?.textContent).toBe('console.log');
  });

  it('renders bold text with <strong> elements', () => {
    const { container } = render(<MarkdownLite text="This is **important** text" />);
    const strong = container.querySelector('strong');
    expect(strong).toBeTruthy();
    expect(strong?.textContent).toBe('important');
  });

  it('renders fenced code blocks in <pre> tags', () => {
    const text = '```js\nconst x = 1;\n```';
    const { container } = render(<MarkdownLite text={text} />);
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    // Should contain highlighted tokens
    const spans = pre?.querySelectorAll('span.hltoken');
    expect(spans && spans.length > 0).toBe(true);
  });

  it('syntax-highlights JS keywords in code blocks', () => {
    const text = '```js\nconst x = 1;\n```';
    const { container } = render(<MarkdownLite text={text} />);
    const keywordSpan = container.querySelector('span.hltoken[data-type="keyword"]');
    expect(keywordSpan).toBeTruthy();
    expect(keywordSpan?.textContent).toBe('const');
  });

  it('handles empty string input', () => {
    const { container } = render(<MarkdownLite text="" />);
    // Should render the container div but no content blocks
    const div = container.firstElementChild;
    expect(div).toBeTruthy();
    // No paragraphs or pre tags
    expect(container.querySelectorAll('p').length).toBe(0);
    expect(container.querySelectorAll('pre').length).toBe(0);
  });

  it('renders multiple paragraphs separated by blank lines', () => {
    const text = 'First paragraph.\n\nSecond paragraph.';
    const { container } = render(<MarkdownLite text={text} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);
  });

  it('renders mixed content: paragraph + code block', () => {
    const text = 'Write a function:\n\n```js\nfunction add(a, b) {\n  return a + b;\n}\n```';
    const { container } = render(<MarkdownLite text={text} />);
    expect(container.querySelectorAll('p').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll('pre').length).toBe(1);
  });

  it('applies custom className to container', () => {
    const { container } = render(<MarkdownLite text="test" className="my-class" />);
    expect(container.firstElementChild?.classList.contains('my-class')).toBe(true);
  });
});
