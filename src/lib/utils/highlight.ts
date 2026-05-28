import { browser } from '$app/environment';

type HighlighterCore = {
  codeToHtml(code: string, opts: { lang: string; theme: string }): string;
};

let highlighterPromise: Promise<HighlighterCore | null> | null = null;

async function loadHighlighter(): Promise<HighlighterCore | null> {
  const [{ createHighlighterCore, createOnigurumaEngine }, theme, langMd] = await Promise.all([
    import('shiki/core'),
    import('shiki/themes/github-dark-default.mjs'),
    import('shiki/langs/markdown.mjs')
  ]);
  const engine = await createOnigurumaEngine(import('shiki/wasm'));
  return createHighlighterCore({
    themes: [theme.default],
    langs: [langMd.default],
    engine
  });
}

export function getHighlighter(): Promise<HighlighterCore | null> | null {
  if (!browser) return null;
  if (!highlighterPromise) {
    highlighterPromise = loadHighlighter().catch(() => null);
  }
  return highlighterPromise;
}

export async function highlightMarkdown(code: string): Promise<string> {
  if (!browser) return `<pre>${escapeHtml(code)}</pre>`;
  const hl = await getHighlighter();
  if (!hl) return `<pre>${escapeHtml(code)}</pre>`;
  try {
    return hl.codeToHtml(code, { lang: 'markdown', theme: 'github-dark-default' });
  } catch {
    return `<pre>${escapeHtml(code)}</pre>`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
