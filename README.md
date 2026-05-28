<div align="center">
<a href="https://newshields.vercel.app">
<img src="assets/newshields.png" alt="New Shields Hero" width="100%" />
</a>
<p></p>
</div>

<div align="center">
    <a href="https://newshields.vercel.app" target="_blank">
        Explore
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="https://newshields.vercel.app/create" target="_blank">
        Badge Builder
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="https://newshields.vercel.app/docs" target="_blank">
        API Docs
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#%EF%B8%8F-stack">
        Stack
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#-getting-started">
        Getting Started
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#%EF%B8%8F-license">
        License
    </a>
</div>

</p>

<div align="center">

<p>
  <img src="https://newshields.vercel.app/api/badge.svg?label=framework&title=Svelte&icon=svelte&theme=sunset" alt="SvelteKit" />
  <img src="https://newshields.vercel.app/api/badge.svg?label=Language&title=TypeScript&icon=typescript&theme=midnight" alt="TypeScript" />
  <img src="https://newshields.vercel.app/api/badge.svg?label=Deployed%20on%20&title=Vercel&icon=vercel_dark&theme=graphite" alt="Vercel" />
  <img src="https://newshields.vercel.app/api/badge.svg?label=api&title=Hono&icon=hono&theme=sunset" alt="Hono" />
  <img src="https://newshields.vercel.app/api/badge.svg?label=api&title=Upstash&icon=upstash&theme=forest" alt="Upstash" />
</p>

<p>
  <a href="https://github.com/konlyzx/newshields/stargazers">
    <img src="https://newshields.vercel.app/api/badge.svg?label=stars&icon=github&theme=graphite" alt="GitHub stars" />
  </a>
  <a href="https://github.com/konlyzx/newshields/forks">
    <img src="https://newshields.vercel.app/api/badge.svg?label=forks&icon=github&theme=graphite" alt="GitHub forks" />
  </a>
  <a href="https://github.com/konlyzx/newshields/issues">
    <img src="https://newshields.vercel.app/api/badge.svg?label=issues&icon=github&theme=graphite" alt="GitHub issues" />
  </a>
</p>

</div>

## ✨ Features

- **🎨 8 Curated Themes** — Aurora, Sunset, Midnight, Forest, Ocean, Ember, Graphite, Plasma — each gradient hand-tuned for dark READMEs
- **⚡ Edge-Rendered** — Fresh SVG render on Vercel's edge under 40ms
- **🔍 SVGL Icons** — Integrated with 3000+ tech icons from SVGL
- **🛠️ Live Builder** — Reactive editor with theme swatches and one-click Markdown copy
- **🔌 Open API** — Single GET endpoint, any param combo, validated and rate-limited
- **♿ Accessible** — Semantic SVG with proper ARIA labels
- **📱 Responsive** — Glassmorphic design that works everywhere

## 🛠️ Stack

- [**SvelteKit** + **Svelte 5**](https://kit.svelte.dev/) - Web development, streamlined.
- [**TypeScript**](https://www.typescriptlang.org/) - JavaScript with syntax for types.
- [**Tailwind CSS**](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [**bits-ui**](https://www.bits-ui.com) - A collection of headless components for Svelte.
- [**clsx**](https://github.com/lukeed/clsx) + [**tailwind-merge**](https://github.com/dcastil/tailwind-merge) - A tiny utility for constructing `className` strings conditionally.
- [**Lucide Icons**](https://lucide.dev/) - Beautiful & consistent icons.
- [**svelte-sonner**](https://github.com/wobsoriano/svelte-sonner) - An opinionated toast component for Svelte.
- [**Hono**](https://hono.dev/) - Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.
- [**@upstash/redis** + **@upstash/ratelimit**](https://upstash.com/) - Serverless Redis for developers.
- [**Shiki**](https://github.com/shikijs/shiki) - A beautiful Syntax Highlighter.

## 🚀 Getting Started

> [!IMPORTANT]
> **Quick usage:** You can start using badges immediately without setting up the project! Just visit [newshields.vercel.app/create](https://newshields.vercel.app/create) to generate your custom badges and copy the Markdown.
> 
> To run the project locally and customize it, follow the steps below.

You will need:

- [Node.js 20+](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

1. **Fork this repository** and clone it locally:

```bash
git clone git@github.com:your_username/newshields.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

Deploy to Vercel:

```bash
pnpm build
```

Or use the Vercel CLI:

```bash
vercel --prod
```

## 🔌 API Usage

### Endpoint

```
GET /api/badge.svg?label={label}&title={title}&icon={icon}&theme={theme}
```

### Parameters

| Param | Description | Example |
|-------|-------------|---------|
| `label` | Left side text | `Powered+by` |
| `title` | Right side text | `Svelte+5` |
| `icon` | Icon ID from SVGL | `svelte`, `react`, `typescript` |
| `theme` | Color theme | `sunset`, `ocean`, `midnight` |

### Example

```markdown
![Powered by Svelte](https://newshields.vercel.app/api/badge.svg?label=Powered+by&title=Svelte&icon=svelte&theme=sunset)
```

### Available Themes

| Theme | Preview |
|-------|---------|
| `aurora` | Green-purple gradient |
| `sunset` | Orange-pink gradient |
| `midnight` | Deep blue-purple |
| `forest` | Emerald gradient |
| `ocean` | Cyan-blue gradient |
| `ember` | Red-orange gradient |
| `graphite` | Gray neutral |
| `plasma` | Purple-pink glow |

## 🔑 License

[MIT](LICENSE) © 2026 Kevin Cheni

---

<div align="center">

<p>
  <a href="https://twitter.com/newshields">
    <img src="https://img.shields.io/badge/𝕏%20Twitter-000000?style=flat&logo=x&logoColor=white" alt="Twitter" />
  </a>
  <a href="https://github.com/konlyzx/newshields">
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

</div>
