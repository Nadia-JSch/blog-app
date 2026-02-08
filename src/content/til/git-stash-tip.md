---
title: "Git stash with a message"
date: "2026-02-05"
description: "Stop losing track of your stashes with named messages."
tags: ["git"]
---

I always forget what's in my git stashes. Turns out you can name them!

```bash
git stash push -m "wip: navbar responsive styles"
```

Then when you list stashes:

```bash
git stash list
# stash@{0}: On main: wip: navbar responsive styles
```

So much easier to find what you need later. No more `git stash pop` roulette.
