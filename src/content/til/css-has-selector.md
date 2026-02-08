---
title: "CSS :has() selector is a game changer"
date: "2026-02-07"
description: "The parent selector we've been waiting for is finally here."
tags: ["css"]
---

Today I learned about the CSS `:has()` selector and it's honestly incredible. We can now style a parent based on its children!

## The basics

```css
/* Style a card differently if it contains an image */
.card:has(img) {
  grid-template-rows: auto 1fr;
}

/* Style a form group when its input is focused */
.form-group:has(input:focus) {
  border-color: pink;
}
```

## Why this matters

Before `:has()`, we needed JavaScript to style parent elements based on their children. Now it's pure CSS. Browser support is solid across all modern browsers now.

## A practical example

```css
/* Add spacing only when a heading is followed by a subtitle */
h1:has(+ .subtitle) {
  margin-bottom: 0.25rem;
}
```

This is going to simplify so many components!
