---
title: "How That Tech Girl Actually Works: A Code Walkthrough"
date: "2026-03-07"
description: "A file-by-file deep dive into the React + Vite PWA you vibe-coded"
tags: ["react", "vite", "ai"]
---

# How That Tech Girl Actually Works: A Code Walkthrough

You vibe-coded this app in an afternoon. It works, it's cute, it has little sparkles. And now you have no idea how it actually works.

That's fine. That's what this is for.

---

## What the app is and what it does

**[That Tech Girl](https://that-tech-girl-app.pages.dev/)** is a PWA (Progressive Web App) — a website that behaves more like a native app — built for women in tech who want a daily dose of confidence alongside a practical skill. Think of it as a pocket ritual: affirmations paired with real coding knowledge, wrapped in a deliberately over-the-top aesthetic complete with bows, pastels, and sparkle animations.

Here's what happens when you open it:

**Daily ritual card** — The hero of the page. Every day surfaces a new affirmation (a hype-up for your mindset) paired with a matching tech lesson — things like `console.table()` for debugging, CSS `minmax()` for responsive layouts, or `git switch` for cleaner branch flow. The pairing is deterministic: the same date always produces the same affirmation, so everyone using the app sees the same "daily drop."

**AI remix** — Hit the "AI remix" button and the app sends your current theme and topic to an AI-powered backend, which generates a fresh affirmation and lesson in the same structure. The static content swaps out for the AI version without a page reload.

**Revision flashcards** — "Draw a card" calls a second backend route that reads one of your own Markdown notes from disk, passes it to an AI model, and gets back a flashcard: a question, an answer, an optional code snippet, and a memorable tip. Your notes become study material automatically.

**Win journal** — A local-only text area where you log what you shipped, figured out, or handled well that day. Nothing leaves the browser. Entries persist in `localStorage` so they're still there tomorrow.

**Themes** — Five palettes (Clean Girl Coder, Strawberry Syntax, Coquette Compiler, Ballet Backend, Midnight Coder) you can switch between at any time. Your choice is saved so the app remembers it on your next visit.

Now let's look at how all of that is actually built.

---

## 1. Data: where the content lives

Open `src/data/content.ts`. Everything static is defined here as plain TypeScript arrays and objects.

### Types first

```ts
export type Affirmation = {
  id: string;
  topic: Topic;
  text: string;
  mantra: string;
  lessonId: string;  // ← links to a Lesson
};

export type Lesson = {
  id: string;
  title: string;
  category: "code" | "career" | "tools";
  summary: string;
  bullets: string[];
  snippet?: string;  // ← optional (? means it can be undefined)
};
```

The `lessonId` on an affirmation is a foreign-key relationship — exactly like a database join, just in memory. Each affirmation points to exactly one lesson.

### Why TypeScript types here?

You get autocomplete and error catching at write-time. If you rename `lessonId` to `lesson_id` in one place but not the other, TypeScript will flag it before you even run the app. Defining your data shapes upfront also makes the rest of the code easier to read — when you see `affirmation.mantra` somewhere in `App.tsx`, you already know what type it is without tracing back through the logic.

---

## 2. The daily algorithm: `src/lib/daily.ts`

The most interesting 14 lines in the project.

```ts
const hashDay = (date: Date) => {
  const dayStamp = date.toISOString().slice(0, 10); // "2026-03-07"
  return dayStamp.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

export const getDailyPair = (date = new Date()) => {
  const hash = hashDay(date);
  const affirmation = affirmations[hash % affirmations.length];
  const lesson = lessons.find((entry) => entry.id === affirmation.lessonId) ?? lessons[0];

  return { affirmation, lesson, dayKey: date.toISOString().slice(0, 10) };
};
```

**What `hashDay` does:** it converts a date string like `"2026-03-07"` into a number by summing the ASCII code of each character (`charCodeAt`). The same date always produces the same number — that's why everyone sees the same daily drop.

**What `% affirmations.length` does:** the modulo operator wraps a big number back into a valid array index. If the hash is `847` and there are `5` affirmations, `847 % 5 = 2`, so you get index 2. The number cycles through all possible indices as the date changes.

**What `?? lessons[0]` does:** the nullish coalescing operator. If `find()` returns `undefined` (the lessonId didn't match anything), fall back to the first lesson. It's a safety net.

**`useMemo(() => getDailyPair(), [])` in App.tsx** — the empty `[]` dependency array means this runs once when the component mounts and never again. Without `useMemo`, it would recalculate on every render. For something as cheap as a date hash that's not a big deal, but it's good habit: if your data doesn't change, don't recompute it.

---

## 3. State management in `App.tsx`

The whole app lives in one component — no Redux, no Zustand, just React's built-in `useState`. Here's what each piece of state is responsible for:

```ts
const [theme, setTheme] = useState<ThemeKey>("coquette-compiler");    // active palette
const [darkMode, setDarkMode] = useState(false);                        // midnight mode
const [journalText, setJournalText] = useState("");                     // textarea value
const [entries, setEntries] = useState<JournalEntry[]>([]);             // saved wins
const [claimedDay, setClaimedDay] = useState("");                       // which day was claimed
const [generated, setGenerated] = useState<GeneratedContent | null>(null); // AI remix result
const [revision, setRevision] = useState<RevisionNote | null>(null);   // flashcard from AI
```

**Why `null` instead of `{}`?** Using `null` as the initial value for `generated` and `revision` is intentional. The UI checks `if (generated)` — a null means "no AI content yet, show the static data." An empty object `{}` would be truthy and break that logic.

### Derived values (not state)

Instead of storing duplicate state, the app computes display values from the state it already has:

```ts
const displayAffirmation = generated?.affirmation ?? dailyPair.affirmation.text;
const displayMantra = generated?.mantra ?? dailyPair.affirmation.mantra;
```

`generated?.affirmation` uses optional chaining — if `generated` is `null`, this short-circuits to `undefined` rather than throwing. Then `??` picks the fallback. This pattern means: "show AI content if it exists, otherwise show the static content."

The key insight here is that derived values are *cheaper than extra state*. You could store `displayAffirmation` in its own `useState`, but then you'd have to keep it in sync manually every time `generated` or `dailyPair` changed. Computing it inline means it's always correct by definition.

---

## 4. Persistence: `localStorage`

The journal and preferences need to survive a page refresh without a database. That's `localStorage`'s job.

### What is localStorage?

`localStorage` is a small key-value store that lives in the browser — think of it like a tiny notepad that the browser keeps for each website you visit. You can save strings to it, and they'll still be there the next time the user opens the page. It's not a real database: there's no querying, no relations, no server. It's just: `setItem("key", value)` to save and `getItem("key")` to read back.

The trade-off is exactly what the app tells you in the UI: "Local-first. Your notes stay in this browser." If you clear your browser data or open the app in a different browser, the journal is gone. For this app that's fine — the journal is a personal daily ritual, not a record you need to share or back up.

Three `useEffect` hooks handle the reading and writing.

**On mount** (empty dependency array `[]`), load saved preferences:

```ts
useEffect(() => {
  const savedTheme = window.localStorage.getItem(storageKeys.theme) as ThemeKey | null;
  const savedJournal = window.localStorage.getItem(storageKeys.journal);
  // ...
}, []);
```

**On theme or darkMode change**, save them and apply CSS classes:

```ts
useEffect(() => {
  const classes = [themes[theme].surfaceClass, darkMode ? "dark-mode" : ""].filter(Boolean);
  document.body.className = classes.join(" ");
  window.localStorage.setItem(storageKeys.theme, theme);
}, [theme, darkMode]);
```

`filter(Boolean)` removes falsy values from the array — if `darkMode` is false, the empty string `""` is removed, so `body.className` doesn't get a stray space.

**The theme system:** `themes[theme].surfaceClass` resolves to a string like `"theme-coquette"`. That CSS class is applied to `document.body`, and all the color variables are scoped to it in `styles.css`. Switching themes is just swapping a class name — no component re-architecture needed, because the styling is all handled in CSS.

---

## 5. The API backend

So far everything has been pure frontend. Now for the part that makes the AI features work: a backend that handles the AI calls.

In local development this is `server/gemini-server.mjs` — a minimal Node HTTP server with no framework. In production (deployed on Cloudflare Pages) it's `functions/api/generate-daily.ts` and `functions/api/revision-note.ts` — Cloudflare Functions that run at the edge. Both expose the same two routes and do the same job; they just run in different environments.

The production version uses **Groq** (`llama-3.3-70b-versatile`) via Groq's API, which is OpenAI-compatible — meaning the request format looks exactly like the OpenAI API you may have seen in tutorials.

### Why a server at all?

Your AI API key must never be in the browser. If you called Groq (or any AI provider) from React directly, anyone who opened DevTools → Network tab could see your key in the request headers and use it on your account. The server keeps the key in an environment variable and acts as a middleman — the browser talks to your server, your server talks to Groq, and the key never leaves the server.

In production, Cloudflare Pages handles the routing automatically: any file in `functions/api/` becomes a live `/api/` endpoint. In local dev, Vite's config proxies `/api` requests to the Node server. Either way, you write `fetch("/api/generate-daily")` in React and it just works.

### What is a route?

A **route** is a URL + HTTP method pair that a server listens for and responds to. Think of it like a menu of actions your server knows how to perform:

| Method | URL | What it means |
|--------|-----|---------------|
| `GET` | `/api/revision-note` | "Give me a flashcard" |
| `POST` | `/api/generate-daily` | "Generate new content using this data I'm sending" |

**GET** is for fetching something. **POST** is for sending data and getting something back. (The other two you'll hear about — PUT and DELETE — are for updating and removing things. Together these four cover what's called **CRUD**: Create, Read, Update, Delete.)

This backend only has GET and POST because it's read-only — it doesn't store anything, it just talks to Groq and returns a result.

### Route 1: `POST /api/generate-daily`

The browser sends a POST request with a JSON body:
```json
{ "theme": "coquette-compiler", "topic": "confidence", "experienceLevel": "early-career" }
```

The server reads the raw request body like this:

```js
const chunks = [];
for await (const chunk of req) {
  chunks.push(chunk);
}
const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
```

This looks complicated, but it's because HTTP requests arrive as a **stream** — a sequence of small binary pieces called chunks, not one big string. Your browser breaks the data into chunks for efficiency. The server collects all chunks into an array, `Buffer.concat` joins them into one piece of binary data, `.toString()` decodes it into a readable string, and `JSON.parse` converts that string into a JavaScript object.

This is exactly what Express's `req.body` does for you automatically behind the scenes — here you're doing it manually because the server uses no framework.

The server then builds a prompt string with those values and calls Groq's API using `fetch`. The prompt explicitly tells the model what JSON shape to return, which the server forwards to the browser.

### Route 2: `GET /api/revision-note`

```js
const pickRandomNote = async () => {
  const files = (await readdir(notesDir)).filter((f) => f.endsWith(".md"));
  const file = files[Math.floor(Math.random() * files.length)];
  const content = await readFile(join(notesDir, file), "utf-8");
  return { filename: file, content };
};
```

`readdir` lists all files in the notes directory (this is a filesystem operation — reading from disk, not a database). The `.filter` keeps only `.md` files. `Math.floor(Math.random() * files.length)` is the standard way to pick a random array index — `Math.random()` returns `0` to `<1`, multiplied by the length gives `0` to `<length`, and `Math.floor` rounds it down to a valid integer index.

The full text of that note is then sent to Groq as context, and the model picks one concept from it to turn into a flashcard question and answer.

### How the AI integration works: prompting for structured data

This is the core of what makes the AI features reliable. You can't just ask an AI model "make me a flashcard" and hope the response is in a format your code can use. Instead, the prompt is very explicit:

```js
const buildRevisionPrompt = (noteContent, noteFilename) => `...
Return JSON only with this exact shape:
{
  "topic": "string",
  "question": "string",
  "answer": "string",
  "codeExample": "string or null",
  "tip": "string"
}
Rules:
- Pick something specific, not a broad topic
- The question should test understanding, not just memory
...`
```

By telling the model exactly what shape to return and giving it rules to follow, you get consistent, parseable output instead of a paragraph of free text. This technique — structuring your prompt to constrain the output — is called **prompt engineering**, and it's how you make AI usable inside real applications.

### Parsing the AI response

Groq uses the OpenAI-compatible chat completions format, so the response looks like this:

```js
const data = await response.json();
const text = data.choices?.[0]?.message?.content ?? "";
const match = text.match(/\{[\s\S]*\}/);
return JSON.parse(match[0]);
```

The model's reply lives at `choices[0].message.content` — a single string. The regex `/\{[\s\S]*\}/` extracts the first `{...}` block from it, which is defensive parsing in case the model adds explanation text before or after the JSON (which it sometimes does even when you ask it not to). `JSON.parse` then turns that string into a JavaScript object the frontend can use.

---

## 6. Async patterns in the frontend

### What async actually means

When your app calls an API, it has to wait for the response. That could take 1 second, or 5. **Asynchronous** code means: "start this thing, and when it finishes, do something with the result — but don't freeze everything else in the meantime."

In JavaScript, `async/await` is how you write that clearly. `async` on a function means it can contain `await` expressions. `await` means "pause here until this promise resolves, then continue." While it's paused, the browser is still responsive — the rest of the UI doesn't freeze.

Both API calls follow the same structure. Here's `generateWithAI`:

```ts
const generateWithAI = async () => {
  setIsGenerating(true);        // show loading state
  setGenerationError("");       // clear any previous error

  try {
    const response = await fetch("/api/generate-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, topic: dailyPair.affirmation.topic, experienceLevel: "early-career" })
    });

    const data = (await response.json()) as { content: GeneratedContent } | { error: string };

    if (!response.ok || !("content" in data)) {
      throw new Error("error" in data ? data.error : "Generation failed.");
    }

    setGenerated(data.content);
  } catch (error) {
    setGenerationError(error instanceof Error ? error.message : "Generation failed.");
  } finally {
    setIsGenerating(false);     // always clears loading, success or fail
  }
};
```

The `try/catch/finally` structure is the standard pattern for async operations that can fail:

- **`try`** — attempt the thing. If anything throws an error inside, jump to `catch`.
- **`catch`** — handle the failure. Here it saves the error message to state so the UI can show it.
- **`finally`** — always runs, success or failure. This guarantees `isGenerating` goes back to `false` even if an error occurs — without it, the button could stay stuck in "Generating..." forever.

**`"content" in data`** is a TypeScript type narrowing check. The response is typed as a union — either it has `content` or it has `error`. Checking which key exists tells TypeScript (and you) which branch you're in. It's like a runtime `if` that also teaches the compiler something.

---

## 7. Details that are easy to miss

These are small decisions that don't make it into architecture diagrams but matter when you're reading the code.

**`renderInlineMarkdown`** (App.tsx line 86) is a hand-rolled mini-parser. It splits text on `**...**` patterns and wraps matches in `<strong>`. This is why AI-generated bullet points can include bold text without pulling in a full Markdown library. Sometimes one focused function beats a dependency.

**`formatDate`** (App.tsx line 79) appends `T00:00:00` before parsing: `new Date("2026-03-07T00:00:00")`. Without the time part, `new Date("2026-03-07")` is interpreted as UTC midnight, which can display as the previous day in timezones behind UTC. Adding a local time fixes that. Date handling is where a surprising number of subtle bugs live.

**`aria-hidden="true"`** on decorative elements (sparkles, bows) tells screen readers to skip them. They're visual flourishes, not content. Accessibility attributes like this are easy to skip when you're focused on making things look right — but they're what makes an app usable for everyone.

---

## What to try next

- **Add a note:** drop a `.md` file into the `coding-notes` folder referenced in `.env` (`NOTES_DIR`) and click "Draw a card" — your own notes become flashcard material.
- **Change the daily algorithm:** edit `hashDay` in `daily.ts` to use a different formula and watch which affirmation surfaces each day.
- **Add a new theme:** add a new key to the `themes` object in `content.ts`, add its CSS variables in `styles.css`, and it immediately appears in the settings panel — the `themeOrder` array is derived from `Object.keys(themes)` automatically.
- **Cache the AI result per day:** store `generated` in `localStorage` under a key that includes `dailyPair.dayKey`. On mount, check if a cached result exists for today before hitting the API.
