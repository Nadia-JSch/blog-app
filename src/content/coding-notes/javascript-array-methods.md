---
title: "JavaScript array methods cheat sheet"
date: "2026-02-03"
description: "The array methods I use most often, with examples."
tags: ["javascript"]
---

A quick reference for the array methods I reach for most.

## Transforming

```javascript
// map — transform each item
const names = users.map(u => u.name);

// flatMap — map + flatten one level
const tags = posts.flatMap(p => p.tags);
```

## Filtering

```javascript
// filter — keep items matching a condition
const active = users.filter(u => u.isActive);

// find — get first match
const admin = users.find(u => u.role === 'admin');
```

## Reducing

```javascript
// reduce — accumulate into a single value
const total = prices.reduce((sum, p) => sum + p, 0);

// group items (using Object.groupBy)
const byRole = Object.groupBy(users, u => u.role);
```

## Checking

```javascript
// some — at least one matches?
const hasErrors = fields.some(f => f.error);

// every — all match?
const allValid = fields.every(f => f.isValid);

// includes — contains a value?
const hasPink = colors.includes('pink');
```

## Sorting

```javascript
// sort mutates! use toSorted() for a copy
const sorted = items.toSorted((a, b) => a.date - b.date);
```

> Tip: `toSorted()`, `toReversed()`, and `toSpliced()` are the immutable versions of `sort()`, `reverse()`, and `splice()`. Use them when you don't want to mutate the original array.
