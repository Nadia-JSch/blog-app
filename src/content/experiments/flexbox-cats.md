---
title: "Flexbox Cats"
date: "2026-02-08"
description: "A visual flexbox playground with cute cats, CSS variables, and way too much flex-wrap."
tags: ["css"]
---

Let's learn flexbox by arranging cats. Below is a live CSS experiment — all styled with flexbox and CSS custom properties.

## The Cat Gallery

<style>
  .cat-lab {
    --cat-size: 120px;
    --cat-gap: 12px;
    --cat-radius: 12px;
    --cat-border: rgba(196, 120, 138, 0.3);
    --cat-shadow: rgba(0, 0, 0, 0.2);
    --label-bg: rgba(13, 11, 14, 0.7);
    --label-text: #d4a0b0;
  }

  .cat-lab {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: var(--cat-gap);
    padding: 1.5rem;
    border: 1px solid var(--cat-border);
    border-radius: 12px;
    margin: 1.5rem 0;
  }

  .cat-card {
    width: var(--cat-size);
    flex-shrink: 0;
    text-align: center;
  }

  .cat-card img {
    width: var(--cat-size);
    height: var(--cat-size);
    object-fit: cover;
    border-radius: var(--cat-radius);
    border: 2px solid var(--cat-border);
    box-shadow: 0 4px 12px var(--cat-shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .cat-card img:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px var(--cat-shadow);
  }

  .cat-card span {
    display: block;
    margin-top: 6px;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .demo-label {
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    background: var(--label-bg);
    color: var(--label-text);
    margin-bottom: 0.5rem;
  }
</style>

<div class="cat-lab">
  <div class="demo-label">justify-content: center + flex-wrap: wrap</div>
  <div class="cat-card">
    <img src="https://placecats.com/millie/200/200" alt="cat 1" />
    <span>millie</span>
  </div>
  <div class="cat-card">
    <img src="https://placecats.com/neo/200/200" alt="cat 2" />
    <span>neo</span>
  </div>
  <div class="cat-card">
    <img src="https://placecats.com/bella/200/200" alt="cat 3" />
    <span>bella</span>
  </div>
  <div class="cat-card">
    <img src="https://placecats.com/200/200" alt="cat 4" />
    <span>whiskers</span>
  </div>
  <div class="cat-card">
    <img src="https://placecats.com/millie/201/201" alt="cat 5" />
    <span>luna</span>
  </div>
</div>

That gallery uses `flex-wrap: wrap` and `justify-content: center` so the cats flow naturally and center themselves. Resize your browser to see them reflow!

## Spacing With Gap

The `gap` property replaces old-school margin hacks. Change `--cat-gap` and everything adjusts:

```css
.cat-lab {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--cat-gap); /* one property, uniform spacing */
}
```

## Row vs Column

<style>
  .cat-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(196, 120, 138, 0.3);
    border-radius: 12px;
    margin: 1rem 0;
    overflow-x: auto;
  }

  .cat-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(196, 120, 138, 0.3);
    border-radius: 12px;
    margin: 1rem 0;
  }

  .cat-row img, .cat-col img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid rgba(196, 120, 138, 0.3);
  }

  .flex-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 0.5rem;
  }
</style>

**`flex-direction: row`** (default) — cats sit side by side:

<div class="cat-row">
  <img src="https://placecats.com/neo/200/200" alt="cat" />
  <img src="https://placecats.com/bella/200/200" alt="cat" />
  <img src="https://placecats.com/200/200" alt="cat" />
  <img src="https://placecats.com/millie/200/200" alt="cat" />
</div>

**`flex-direction: column`** — cats stack vertically:

<div class="cat-col">
  <img src="https://placecats.com/neo/200/200" alt="cat" />
  <img src="https://placecats.com/bella/200/200" alt="cat" />
  <img src="https://placecats.com/200/200" alt="cat" />
</div>

## CSS Variables Make It Tweakable

The whole gallery is controlled by a few custom properties. Change them and everything updates:

```css
.cat-lab {
  --cat-size: 120px;    /* try 80px or 160px */
  --cat-gap: 12px;      /* try 4px or 24px */
  --cat-radius: 12px;   /* try 50% for circles */
  --cat-border: rgba(196, 120, 138, 0.3);
}
```

Try setting `--cat-radius: 50%` in your devtools to turn all the cat photos into circles. Or bump `--cat-size` up to `200px` for big chonky cat cards.

## The Flexbox Properties Used

| Property | What it does | Our value |
|----------|-------------|-----------|
| `display: flex` | Enables flexbox on the container | — |
| `flex-wrap: wrap` | Allows items to wrap to new lines | wrapping gallery |
| `flex-direction` | Row (horizontal) or column (vertical) | both demoed |
| `justify-content` | Alignment along the main axis | `center` |
| `align-items` | Alignment along the cross axis | `flex-start` / `center` |
| `gap` | Spacing between flex items | `var(--cat-gap)` |
| `flex-shrink: 0` | Prevents items from shrinking below their size | fixed cat cards |

That's it! Flexbox is honestly one of the most satisfying parts of CSS once it clicks. And everything is better with cats.
