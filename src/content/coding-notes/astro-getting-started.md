---
title: "Getting started with Astro"
date: "2026-02-06"
description: "Notes from setting up my first Astro project — what I liked and what tripped me up."
tags: ["astro"]
draft: true
---

I just set up this blog with Astro and here are my notes for next time.

## What is Astro?

Astro is a static site generator that ships zero JavaScript by default. You write components (`.astro` files) that look like a mix of JSX and HTML, with a frontmatter script block at the top fenced by `---`.

## Project structure

```
src/
  layouts/     → reusable page shells
  pages/       → file-based routing
  components/  → reusable UI pieces
  content/     → markdown blog posts
  styles/      → global CSS
```

## Things I love

- **Zero JS by default** — pages are pure HTML unless you opt in
- **File-based routing** — drop a file in `pages/` and it just works
- **Markdown support** — write posts in `.md` with frontmatter, use layouts
- **Scoped styles** — `<style>` in `.astro` files is scoped automatically

## Gotchas

- `Astro.glob()` paths must be string literals (no variables)
- Markdown files need a `layout` in frontmatter to use a custom layout
- Dynamic routes need `getStaticPaths()` for static builds

## Useful commands

```bash
npm run dev      # start dev server
npm run build    # build for production
npm run preview  # preview the build locally
```

Overall really impressed with how simple and fast it is. Highly recommend for blogs and docs sites.
