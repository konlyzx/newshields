<script lang="ts">
  import { Code2, Sparkles, ArrowRight, Copy } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { copyToClipboard } from '$lib/utils/clipboard';

  const ENDPOINT = '/api/badge.svg';
  const BASE_URL = 'https://newshields.vercel.app';
  const EXAMPLE_URL = `${ENDPOINT}?label=Built+with&title=Svelte&icon=svelte&theme=aurora`;

  async function copy(value: string, what: string) {
    const ok = await copyToClipboard(value);
    if (ok) toast.success(`${what} copied`, { duration: 1200 });
  }

  type NavItem = { id: string; label: string; children?: { id: string; label: string }[] };
  const sections: NavItem[] = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'quickstart', label: 'Quick start' },
    {
      id: 'endpoint', label: 'Endpoint',
      children: [
        { id: 'parameters', label: 'Parameters' },
        { id: 'validation', label: 'Validation' },
      ]
    },
    { id: 'themes', label: 'Themes' },
    { id: 'response', label: 'Response' },
    { id: 'errors', label: 'Errors' },
    { id: 'github', label: 'GitHub READMEs' },
    { id: 'selfhost', label: 'Self-host' },
  ];
</script>

<svelte:head>
  <title>API Docs — New Shields</title>
  <meta name="description" content="Documentation for the New Shields edge-rendered badge API." />
</svelte:head>

<div class="docs-layout mx-auto max-w-[1100px] px-6 pt-28 pb-32 sm:pt-32">

<aside class="docs-sidebar" aria-label="Page navigation">
  <p class="sidebar-heading">On this page</p>
  <nav class="sidebar-nav">
    {#each sections as s (s.id)}
      <a href="#{s.id}" class="sidebar-link">{s.label}</a>
      {#if s.children}
        <div class="sidebar-children">
          <div class="sidebar-line"></div>
          {#each s.children as child (child.id)}
            <a href="#{child.id}" class="sidebar-child-link">{child.label}</a>
          {/each}
        </div>
      {/if}
    {/each}
  </nav>
</aside>

<div class="docs-shell">

  <article class="docs-article">

    <section id="introduction" class="doc-section">
      <h1>The Shield API</h1>
      <p>A single <strong>GET</strong> endpoint returns a fresh SVG rendered on the Cloudflare edge — no client-side JavaScript, no third-party CDN, no stale cache.</p>
      <p>Every badge is built from four simple query parameters, validated at the edge, and returned as an immutable <code>image/svg+xml</code> response in under 40ms p99.</p>
      <blockquote>
        <p><code>GET {BASE_URL}/api/badge.svg?label=…&title=…&icon=…&theme=…</code></p>
      </blockquote>
    </section>

    <hr />

    <section id="quickstart" class="doc-section">
      <h2>Quick start</h2>
      <p>Drop this one-liner into any README, blog post, or HTML page and you're done:</p>
      <pre><code>![My Badge]({BASE_URL}/api/badge.svg?label=Built+with&title=Svelte&icon=svelte&theme=aurora)</code></pre>
      <p>Or embed it as an <code>&lt;img&gt;</code> tag in any HTML document:</p>
      <pre><code>&lt;img src="{BASE_URL}/api/badge.svg?label=Built+with&title=Svelte&icon=svelte&theme=aurora" alt="Built with Svelte" /&gt;</code></pre>
      <div class="not-prose mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onclick={() => copy(`${BASE_URL}${EXAMPLE_URL}`, 'URL')}
          class="snake-border inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Copy class="h-3.5 w-3.5" />
          Copy example URL
        </button>
        <a
          href="/create"
          class="snake-border inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Sparkles class="h-3.5 w-3.5" />
          Build visually instead
        </a>
      </div>
    </section>

    <hr />

    <section id="endpoint" class="doc-section">
      <h2>Endpoint</h2>
      <p>There is one public endpoint. All parameters are passed as query strings.</p>
      <div class="endpoint-box">
        <span class="method">GET</span>
        <span class="path">/api/badge.svg</span>
      </div>
      <p>The endpoint is served from Cloudflare's global edge network. Requests are rate-limited to <strong>60 per minute per IP</strong>. Responses are cached with <code>Cache-Control: public, max-age=31536000, immutable</code>.</p>
    </section>

    <hr />

    <section id="parameters" class="doc-section">
      <h2>Parameters</h2>
      <p>All parameters are <strong>optional</strong> — sane defaults are applied when omitted.</p>

      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Default</th><th>Max length</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>Powered by</code></td>
            <td>28 chars</td>
            <td>Upper-line text displayed above the title.</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td><code>New Shields</code></td>
            <td>36 chars</td>
            <td>Lower-line bold text — the main badge name.</td>
          </tr>
          <tr>
            <td><code>icon</code></td>
            <td><code>string</code></td>
            <td><code>svelte</code></td>
            <td>—</td>
            <td>Any <a href="https://svgl.app" target="_blank" rel="noopener noreferrer">SVGL</a> slug. Unknown slugs render a placeholder.</td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td><code>enum</code></td>
            <td><code>aurora</code></td>
            <td>—</td>
            <td>One of the 8 preset themes. See <a href="#themes">Themes</a>.</td>
          </tr>
        </tbody>
      </table>

      <h3 id="validation">Validation rules</h3>
      <ul>
        <li>Strings are URL-decoded and trimmed before validation.</li>
        <li>Parameters exceeding max length return <code>400 Bad Request</code>.</li>
        <li>Unknown <code>theme</code> values silently fall back to <code>aurora</code>.</li>
        <li>Unknown <code>icon</code> slugs render an empty placeholder rectangle.</li>
      </ul>
    </section>

    <hr />

    <section id="themes" class="doc-section">
      <h2>Themes</h2>
      <p>Eight hand-tuned presets are available. Each defines a surface gradient, accent border, glow color, and text colors for label and title.</p>

      <div class="not-prose grid grid-cols-2 gap-2 sm:grid-cols-4 my-6">
        {#each ['aurora', 'sunset', 'midnight', 'forest', 'ocean', 'plasma', 'graphite', 'candy'] as t (t)}
          <button
            type="button"
            onclick={() => copy(t, 'Theme name')}
            class="snake-border group flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5 text-left ring-1 ring-white/[0.06] transition hover:bg-white/[0.06] hover:ring-white/15"
          >
            <span class="font-mono text-xs text-white/70 group-hover:text-white">{t}</span>
            <Copy class="h-3 w-3 text-white/20 opacity-0 transition group-hover:opacity-100 group-hover:text-white/50" />
          </button>
        {/each}
      </div>

      <p>Pass the theme name as the <code>theme</code> query parameter. Full palette definition in <code>src/content/themes.ts</code>.</p>
    </section>

    <hr />

    <section id="response" class="doc-section">
      <h2>Response</h2>
      <p>A successful request returns <code>200 OK</code> with the following headers:</p>
      <pre><code>HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset=utf-8
Cache-Control: public, max-age=31536000, immutable
Vary: Accept-Encoding</code></pre>
      <p>The body is a fully self-contained <code>&lt;svg&gt;</code> — embedded gradients, inline icon <code>&lt;path&gt;</code> data, no external font or image requests.</p>
    </section>

    <hr />

    <section id="errors" class="doc-section">
      <h2>Errors</h2>
      <p>Error responses are plain text with an appropriate HTTP status code.</p>
      <table>
        <thead>
          <tr><th>Status</th><th>When</th></tr>
        </thead>
        <tbody>
          <tr><td><code>400</code></td><td>A parameter exceeds its maximum length or is otherwise invalid.</td></tr>
          <tr><td><code>429</code></td><td>Rate limit exceeded — more than 60 requests per minute from the same IP.</td></tr>
          <tr><td><code>500</code></td><td>Renderer error. Edge-cached responses may still be served.</td></tr>
        </tbody>
      </table>
    </section>

    <hr />

    <section id="github" class="doc-section">
      <h2>GitHub READMEs</h2>
      <p>GitHub proxies all <code>&lt;img&gt;</code> tags through <a href="https://github.com/atmos/camo" target="_blank" rel="noopener noreferrer">camo</a>, a server-side image proxy. This means the badge is fetched once by camo and cached — individual visitors don't hit the edge directly.</p>
      <p>To bust GitHub's camo cache and force a re-fetch, append a version query string:</p>
      <pre><code>![Badge]({BASE_URL}/api/badge.svg?icon=svelte&theme=aurora&v=2)</code></pre>
      <p>Increment <code>v</code> whenever you want GitHub to pull a fresh version.</p>
    </section>

    <hr />

    <section id="selfhost" class="doc-section">
      <h2>Self-host</h2>
      <p><strong>New Shields</strong> is MIT-licensed. Deploy your own instance to Cloudflare Pages in three commands:</p>
      <pre><code>git clone https://github.com/konlyzx/newshields
cd newshields && pnpm install
pnpm deploy</code></pre>
      <p>The API lives in <code>src/routes/api/badge.svg/+server.ts</code> and only depends on the Cloudflare Workers runtime — no Node-specific APIs required.</p>

      <div class="not-prose mt-10 flex flex-wrap items-center gap-3">
        <a
          href="/create"
          class="snake-border inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Sparkles class="h-4 w-4" />
          Try the builder
          <ArrowRight class="h-3.5 w-3.5" />
        </a>
        <a
          href="/"
          class="snake-border inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Code2 class="h-4 w-4" />
          Browse the catalog
        </a>
      </div>
    </section>

  </article>

</div>

</div>

<style>

  .docs-sidebar {
    display: none;
  }

  @media (min-width: 1024px) {
    .docs-sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 7rem;
      left: max(1.5rem, calc(50vw - 550px));
      width: 180px;
      max-height: calc(100vh - 8rem);
      overflow-y: auto;
      margin-left: -6rem;
    }

    .docs-shell {
      padding-left: 210px;
    }
  }

  @media (min-width: 1280px) {
    .docs-sidebar {
      left: max(1.5rem, calc(50vw - 580px));
      width: 200px;
    }
    .docs-shell {
      padding-left: 230px;
    }
  }

  .sidebar-heading {
    margin-bottom: 1rem;
    font-family: ui-monospace, monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.25);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
  }

  .sidebar-link {
    display: block;
    padding: 0.45rem 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.15s;
    line-height: 1.4;
  }

  .sidebar-link:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  .sidebar-children {
    position: relative;
    margin-left: 0.75rem;
    margin-bottom: 0.25rem;
    display: flex;
    flex-direction: column;
  }

  .sidebar-line {
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 1px;
    background: rgba(255, 255, 255, 0.07);
  }

  .sidebar-child-link {
    display: block;
    padding: 0.35rem 0 0.35rem 0.85rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition: color 0.15s;
    line-height: 1.4;
  }

  .sidebar-child-link:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .docs-article :global(h1) {
    font-family: 'Anton', 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    line-height: 0.95;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.4) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 1.25rem;
  }
  .docs-article :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin-top: 3rem;
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  .docs-article :global(h3) {
    font-size: 1.05rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.88);
    margin-top: 1.75rem;
    margin-bottom: 0.6rem;
  }
  .docs-article :global(p) {
    color: rgba(255, 255, 255, 0.62);
    line-height: 1.75;
    margin: 0.8rem 0;
    font-size: 0.95rem;
  }
  .docs-article :global(a) {
    color: rgb(196, 181, 253);
    text-decoration: none;
    border-bottom: 1px solid rgba(196, 181, 253, 0.3);
    transition: border-color 0.2s, color 0.2s;
  }
  .docs-article :global(a:hover) {
    color: white;
    border-bottom-color: white;
  }
  .docs-article :global(blockquote) {
    margin: 1.25rem 0;
    padding: 0.9rem 1.1rem;
    border-left: 2px solid rgba(168, 85, 247, 0.5);
    background: rgba(255, 255, 255, 0.025);
    border-radius: 0 0.5rem 0.5rem 0;
    color: rgba(255, 255, 255, 0.75);
  }
  .docs-article :global(blockquote p) {
    margin: 0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.85rem;
  }
  .docs-article :global(blockquote code) {
    background: transparent;
    padding: 0;
  }
  .docs-article :global(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
    margin: 3.5rem 0;
  }
  .doc-section {
    scroll-margin-top: 7rem;
  }
  .endpoint-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
    padding: 0.85rem 1.1rem;
    margin: 1.25rem 0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }
  .endpoint-box .method {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #4ade80;
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid rgba(74, 222, 128, 0.2);
    border-radius: 0.3rem;
    padding: 0.2rem 0.5rem;
  }
  .endpoint-box .path {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.9);
  }
  .docs-article :global(code) {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.85em;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.35rem;
    padding: 0.12rem 0.4rem;
    color: rgba(255, 255, 255, 0.92);
  }
  .docs-article :global(pre) {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
    padding: 1rem 1.15rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.82rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
    margin: 1.25rem 0;
  }
  .docs-article :global(pre code) {
    background: transparent;
    border: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }
  .docs-article :global(table) {
    width: 100%;
    margin: 1.5rem 0;
    border-collapse: collapse;
    font-size: 0.875rem;
    overflow: hidden;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  .docs-article :global(thead) {
    background: rgba(255, 255, 255, 0.035);
  }
  .docs-article :global(th) {
    text-align: left;
    padding: 0.7rem 1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .docs-article :global(td) {
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.68);
    vertical-align: top;
  }
  .docs-article :global(tbody tr:last-child td) {
    border-bottom: none;
  }
  .docs-article :global(td code),
  .docs-article :global(th code) {
    font-size: 0.78em;
  }
  .docs-article :global(ul),
  .docs-article :global(ol) {
    margin: 0.75rem 0 0.75rem 1.25rem;
    color: rgba(255, 255, 255, 0.65);
  }
  .docs-article :global(li) {
    margin: 0.35rem 0;
  }
  .docs-article :global(strong) {
    color: white;
    font-weight: 600;
  }
  .docs-article :global(h2) {
    scroll-margin-top: 7rem;
  }
</style>
