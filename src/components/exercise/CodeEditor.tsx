import { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, historyKeymap, history, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { ExerciseType, Theme } from '../../types';
import { useAppSelector } from '../../features/store';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  onRun?: () => void;
  language: ExerciseType | 'css-only';
  readOnly?: boolean;
  minHeight?: string;
  placeholder?: string;
}

/** Light theme extension for CodeMirror */
const lightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#f8f9fb',
      color: '#1e293b',
    },
    '.cm-scroller': { fontFamily: '"Source Code Pro", monospace' },
    '.cm-gutters': {
      backgroundColor: '#f1f5f9',
      color: '#94a3b8',
      border: 'none',
      borderRight: '1px solid #e2e8f0',
    },
    '.cm-activeLineGutter': { backgroundColor: '#e2e8f0' },
    '.cm-activeLine': { backgroundColor: '#eef2ff' },
    '.cm-cursor': { borderLeftColor: '#6366f1' },
    '.cm-selectionBackground': { backgroundColor: '#c7d2fe' },
    '&.cm-focused .cm-selectionBackground': { backgroundColor: '#c7d2fe' },
  },
  { dark: false }
);

/** High contrast theme extension for CodeMirror */
const highContrastTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#000000',
      color: '#ffffff',
    },
    '.cm-scroller': { fontFamily: '"Source Code Pro", monospace' },
    '.cm-gutters': {
      backgroundColor: '#0a0a0a',
      color: '#b0b0b0',
      border: 'none',
      borderRight: '1px solid #444444',
    },
    '.cm-activeLineGutter': { backgroundColor: '#1a1a1a' },
    '.cm-activeLine': { backgroundColor: '#1a1a1a' },
    '.cm-cursor': { borderLeftColor: '#a5b4fc', borderLeftWidth: '3px' },
    '.cm-selectionBackground': { backgroundColor: '#334155' },
    '&.cm-focused .cm-selectionBackground': { backgroundColor: '#334155' },
  },
  { dark: true }
);

function getLanguageExtension(lang: ExerciseType | 'css-only') {
  switch (lang) {
    case 'js': return javascript({ jsx: false, typescript: false });
    case 'html':
    case 'html-css': return html();
    case 'css':
    case 'css-only': return css();
    default: return javascript();
  }
}

function getThemeExtension(theme: Theme) {
  return theme === 'high-contrast' ? highContrastTheme
    : theme === 'dark' ? oneDark
      : lightTheme;
}

/**
 * CodeMirror 6 editor with language switching, dark/light/high-contrast theme sync,
 * Ctrl+Enter keybinding for run, and live onChange.
 *
 * Uses Compartments for theme and language so changes are applied via dispatch
 * instead of destroying/recreating the editor. This preserves undo history,
 * cursor position, scroll position, and selection across theme/language changes.
 */
export default function CodeEditor({
  value,
  onChange,
  onRun,
  language,
  readOnly = false,
  minHeight = '300px',
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const theme = useAppSelector((s) => s.ui.theme);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);

  // Compartment refs — stable across renders, reconfigured via dispatch
  const themeCompartment = useRef(new Compartment());
  const languageCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());

  // Keep callback refs current
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onRunRef.current = onRun; }, [onRun]);

  /** Initialize editor once */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const runKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
      {
        key: 'Mod-Enter',
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        bracketMatching(),
        autocompletion(),
        languageCompartment.current.of(getLanguageExtension(language)),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        runKeymap,
        updateListener,
        themeCompartment.current.of(getThemeExtension(theme)),
        EditorView.theme({
          '&': { minHeight, height: '100%' },
          '.cm-scroller': {
            fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
            fontSize: '13px',
            lineHeight: '1.6',
          },
        }),
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;
    // Expose view on container for e2e test access
    (containerRef.current as unknown as Record<string, EditorView>).__cmView = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Create once — compartments handle dynamic changes

  /** Reconfigure theme without remounting */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.current.reconfigure(getThemeExtension(theme)),
    });
  }, [theme]);

  /** Reconfigure language without remounting */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: languageCompartment.current.reconfigure(getLanguageExtension(language)),
    });
  }, [language]);

  /** Reconfigure readOnly without remounting */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  /** Sync external value changes (e.g. loading saved solution) */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden"
      style={{
        backgroundColor: theme === 'high-contrast' ? '#000000' : theme === 'dark' ? '#080a0f' : '#f8f9fb',
        borderRadius: '0',
      }}
      aria-label="Code editor"
      data-testid="code-editor"
    />
  );
}
