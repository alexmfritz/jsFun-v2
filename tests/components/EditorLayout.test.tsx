import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditorLayout from '../../src/components/exercise/EditorLayout';

// Mock CodeEditor since it creates a CodeMirror instance which requires DOM APIs
vi.mock('../../src/components/exercise/CodeEditor', () => ({
  default: ({ value, language }: { value: string; language: string }) => (
    <div data-testid={`editor-${language}`} data-value={value}>
      CodeEditor({language})
    </div>
  ),
}));

function renderLayout(type: 'js' | 'html' | 'css' | 'html-css') {
  return render(
    <EditorLayout
      exerciseType={type}
      code="<div>Hello</div>"
      cssCode="body { color: red; }"
      onCodeChange={vi.fn()}
      onCssChange={vi.fn()}
      onRun={vi.fn()}
    />
  );
}

describe('EditorLayout', () => {
  describe('JS type', () => {
    it('renders a single JS editor', () => {
      renderLayout('js');
      expect(screen.getByTestId('editor-js')).toBeTruthy();
      expect(screen.queryByTestId('editor-css')).toBeNull();
      expect(screen.queryByTestId('editor-css-only')).toBeNull();
    });
  });

  describe('HTML type', () => {
    it('renders a single HTML editor', () => {
      renderLayout('html');
      expect(screen.getByTestId('editor-html')).toBeTruthy();
      expect(screen.queryByTestId('editor-css')).toBeNull();
    });
  });

  describe('CSS type', () => {
    it('renders a single CSS editor', () => {
      renderLayout('css');
      expect(screen.getByTestId('editor-css')).toBeTruthy();
      expect(screen.queryByTestId('editor-html')).toBeNull();
    });
  });

  describe('HTML-CSS type', () => {
    it('renders dual editors side by side', () => {
      renderLayout('html-css');
      expect(screen.getByTestId('editor-html')).toBeTruthy();
      expect(screen.getByTestId('editor-css-only')).toBeTruthy();
    });

    it('shows HTML and CSS labels', () => {
      renderLayout('html-css');
      expect(screen.getByText('HTML')).toBeTruthy();
      expect(screen.getByText('CSS')).toBeTruthy();
    });
  });
});
