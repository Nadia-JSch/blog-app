---
title: "How This Blog App Actually Works"
date: "2026-02-08"
description: "A personal walkthrough of how all the pieces of this Astro blog connect — written for myself to come back to."
tags: ["astro"]
draft: false
---

## What's in the project?

The whole app lives inside `src/`. Here's what each folder does:

```
src/
├── content/           I write blog posts here (markdown files)
├── pages/             These create the actual URLs people visit
├── layouts/           The page templates that wrap everything
├── components/        Small reusable UI pieces
├── styles/            The CSS theme (colors, fonts, etc.)
└── content.config.ts  Rules about what blog posts should look like
```

That's it. Six things. Let me explain each one.

## content/ — Where I write

This is the only folder I touch regularly. Each subfolder is a section of the blog:

```
content/
├── til/                → shows up at /til
├── coding-notes/       → shows up at /coding-notes
├── thoughts/           → shows up at /thoughts
└── experiments/        → shows up at /experiments
```

Each section contains `.md` (markdown) files. One file = one post. The filename becomes the URL. So `content/til/css-has-selector.md` becomes the page at `/til/css-has-selector`.

Every markdown file starts with a block between `---` marks called frontmatter. It's not part of the post — it's info *about* the post:

```markdown
---
title: "CSS :has() selector is a game changer"
date: "2026-02-07"
description: "The parent selector we've been waiting for."
tags: ["css"]
draft: false
---

The actual post content starts here. Just write in markdown.
Headings, code blocks, lists, links — all normal markdown.
```

Here's what each field does:

- **title** — the big heading at the top of the post
- **date** — used for sorting (newest posts appear first)
- **description** — the short summary on listing pages
- **tags** — one tag per post, used for the `/tags/...` pages
- **draft** — set to `true` and the post disappears from the site but stays in the folder

To publish a new post: create a `.md` file, add the frontmatter, write below it. That's literally it.

## pages/ — Where URLs come from

This is the part that confused me the most at first. **The folder structure inside `pages/` directly maps to URLs on the site.** Astro calls this "file-based routing."

```
pages/
├── index.astro              →  /              (homepage)
├── til/
│   ├── index.astro          →  /til           (list of TIL posts)
│   └── [id].astro           →  /til/css-has-selector
│                                /til/git-stash-tip
│                                (one page per post)
├── coding-notes/
│   ├── index.astro          →  /coding-notes
│   └── [id].astro           →  /coding-notes/javascript-array-methods
├── thoughts/
│   ├── index.astro          →  /thoughts
│   └── [id].astro           →  /thoughts/ai-and-learning-to-code
├── experiments/
│   ├── index.astro          →  /experiments
│   └── [id].astro           →  /experiments/flexbox-cats
└── tags/
    └── [tag].astro          →  /tags/css
                                 /tags/git
                                 /tags/javascript
                                 (one page per tag)
```

Two important things to notice:

**1. `index.astro` = the main page for that folder.** Just like how `index.html` is the default page of a website. So `pages/til/index.astro` creates the `/til` page that lists all TIL posts.

**2. `[id].astro` = a template that creates many pages.** The square brackets mean "this part of the URL is a variable." Astro looks at all the posts in the content folder and creates one page for each. So one `[id].astro` file turns into as many pages as there are markdown files.

How does Astro know what IDs to use? Inside `[id].astro` there's a function called `getStaticPaths()`. It says "go get all the posts from this collection and create a page for each one." Here's what it actually looks like:

```javascript
export async function getStaticPaths() {
  const posts = await getCollection('til', (p) => !p.data.draft);
  return posts.map((post) => ({
    params: { id: post.id },   // the URL slug
    props: { post },           // the post data, passed to the page
  }));
}
```

Notice the `!p.data.draft` filter — that's the drafts system. Posts with `draft: true` in their frontmatter get filtered out here, so no page is generated for them.

### What the listing pages do

Each `index.astro` (like `pages/til/index.astro`) does three things:

1. Fetches all posts from its collection: `getCollection('til')`
2. Sorts them by date (newest first)
3. Renders a `PostCard` component for each one

That's how the list of posts on `/til` or `/coding-notes` gets populated — it reads the markdown files and generates the list automatically.

### What the individual post pages do

Each `[id].astro` does:

1. Fetches all posts (to know what pages to create)
2. For the current post, converts the markdown to HTML using `render()`
3. Passes the result to `PostLayout` which wraps it with a title, date, and tags

## layouts/ — The page wrappers

Layouts are templates that wrap content. Think of them like Russian nesting dolls.

**BaseLayout.astro** is the outermost shell. Every single page on the site uses it. It provides:

- The HTML `<head>` (page title, meta tags, fonts)
- The navigation bar at the top (pg of code, Today I Learned, Coding Notes, etc.)
- The footer at the bottom
- The dark/light theme toggle and its JavaScript
- A `<slot />` in the middle — this is a placeholder where each page inserts its own content

When I visit `/til`, Astro takes the content from `pages/til/index.astro` and drops it into BaseLayout's `<slot />`. The nav and footer are always there — only the middle changes.

**PostLayout.astro** is a second layer for individual posts. It sits *inside* BaseLayout and adds:

- The post title as a big heading
- The formatted date (turns "2026-02-08" into "February 8, 2026")
- The tag as a clickable pill that links to `/tags/...`
- An optional header image (if the frontmatter includes `image:`)
- Another `<slot />` for the actual post content

So the nesting for a post page looks like this:

```
BaseLayout (nav, footer, theme)
  └── PostLayout (title, date, tag)
        └── Your markdown content (converted to HTML)
```

## components/ — Reusable building blocks

Right now there's just one: **PostCard.astro**. It's the card that shows up on listing pages — the one with the date, title, description, and tag pill.

Every listing page (`/til`, `/coding-notes`, `/thoughts`, `/experiments`) uses the same PostCard. I write it once, and use it everywhere by passing different data to it:

```html
<PostCard
  title="CSS :has() selector is a game changer"
  date="2026-02-07"
  description="The parent selector we've been waiting for."
  url="/til/css-has-selector"
  tags={["css"]}
/>
```

The values passed in (title, date, etc.) are called **props**. The component receives them and renders a card. Same component, different data each time.

## styles/global.css — The theme

This is one file that controls the entire visual look. It works using **CSS custom properties** (variables):

```css
:root {
  --bg: #0d0b0e;           /* dark background */
  --text: #d4cad8;          /* light text */
  --text-heading: #d4a0b0;  /* dusty rose headings */
  --border: #2a2230;        /* subtle borders */
  /* ...more variables */
}

[data-theme="light"] {
  --bg: #f5f0ed;            /* light background */
  --text: #2e2230;          /* dark text */
  --text-heading: #6e2848;  /* burgundy headings */
  /* ...same variable names, different values */
}
```

Every component uses these variable names (like `var(--bg)`) instead of actual color codes. When the theme toggle switches between dark and light, it just swaps which set of values is active. Everything updates instantly because they all reference the same variable names.

That's also how syntax highlighting works — the Shiki code highlighter generates two sets of colors (Rose Pine for dark, Rose Pine Dawn for light) and CSS toggles between them.

## content.config.ts — The rules

This file tells Astro what content collections exist and what frontmatter fields they should have:

```typescript
const postSchema = z.object({
  title: z.string(),              // required
  date: z.string(),               // required
  description: z.string().optional(),  // optional
  tags: z.array(z.string()).optional(), // optional
  draft: z.boolean().optional(),       // optional
});
```

If I forget to add a `title` to a post, or put a number where a string should be, Astro will throw an error during build instead of silently breaking. It's like a safety net for my frontmatter.

## How everything connects: the full journey

When someone visits `/til/css-has-selector`, here's exactly what happens:

```
1. content/til/css-has-selector.md
   I wrote this. It's just markdown with frontmatter.
          ↓
2. content.config.ts
   Validates the frontmatter. Confirms title,
   date, tags, draft are the right types.
          ↓
3. pages/til/[id].astro
   getStaticPaths() found this post and created
   a page for it. render() converted the markdown
   to HTML.
          ↓
4. layouts/PostLayout.astro
   Wrapped the HTML in a post template with
   the title, date, and tag pill.
          ↓
5. layouts/BaseLayout.astro
   Wrapped everything in the site shell — nav,
   footer, theme toggle, global styles.
          ↓
6. Browser receives the final HTML page.
```

And for a listing page like `/til`:

```
1. pages/til/index.astro
   Calls getCollection('til') to get all posts.
   Filters out drafts. Sorts by date.
          ↓
2. components/PostCard.astro
   Renders a card for each post.
          ↓
3. layouts/BaseLayout.astro
   Wraps the whole list in the site shell.
          ↓
4. Browser receives the listing page.
```

## Quick reference: what to do

| I want to... | I go to... |
|-------------|-----------|
| Write a new post | `src/content/<section>/new-post.md` |
| Unpublish a post | Add `draft: true` to its frontmatter |
| Change the nav or footer | `src/layouts/BaseLayout.astro` |
| Change how posts look | `src/layouts/PostLayout.astro` |
| Change how post cards look | `src/components/PostCard.astro` |
| Change colors or fonts | `src/styles/global.css` |
| Add a new section | `content.config.ts` + `pages/` folder + nav link |
| Change the homepage | `src/pages/index.astro` |

The most important thing: **I only need to touch markdown files to write posts.** Everything else is plumbing that's already set up.
