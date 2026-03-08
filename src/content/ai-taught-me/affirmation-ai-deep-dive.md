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

**AI remix** — Hit the "AI remix" button and the app sends your current theme and topic to an AI-powered backend, which generates a completely fresh affirmation and lesson. The static content swaps out for the AI version without a page reload.

**Revision flashcards** — "Draw a card" calls a backend route that picks one of your bundled Markdown notes, passes it to an AI model, and gets back a flashcard: a question, an answer, an optional code snippet, and a memorable tip. Your own notes become study material.

**Win journal** — A local-only text area where you log what you shipped, figured out, or handled well that day. Nothing leaves the browser. Entries persist in `localStorage` so they're still there tomorrow.

**Themes** — Five palettes (Clean Girl Coder, Strawberry Syntax, Coquette Compiler, Ballet Backend, Midnight Coder) you can switch between at any time. Your choice is saved so the app remembers it on your next visit.

Now let's look at how all of that is actually built.

---

## 1. Data: where the content lives

Open `src/data/content.ts`. Everything static — affirmations, lessons, themes — is defined here as plain TypeScript arrays and objects. No database, no API call, just JavaScript data.

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
  snippet?: string;  // ← the ? means this field is optional
};
```

These `type` declarations are TypeScript telling your editor "here's the exact shape of this data." If you later try to write `affirmation.mantrea` (a typo), TypeScript flags it immediately — before you even run the app. That's the main benefit: catching mistakes at write-time, not at runtime when a user sees a broken screen.

The `lessonId` on an affirmation works like a link between two tables — exactly like a database join, but entirely in memory. Each affirmation points to exactly one lesson by ID.

---

## 2. The daily algorithm: `src/lib/daily.ts`

The most interesting 14 lines in the project. This is what makes the "daily drop" work — same affirmation for everyone on the same day, no database required.

```ts
const hashDay = (date: Date) => {
  const dayStamp = date.toISOString().slice(0, 10); // "2026-03-08"
  return dayStamp.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

export const getDailyPair = (date = new Date()) => {
  const hash = hashDay(date);
  const affirmation = affirmations[hash % affirmations.length];
  const lesson = lessons.find((entry) => entry.id === affirmation.lessonId) ?? lessons[0];

  return { affirmation, lesson, dayKey: date.toISOString().slice(0, 10) };
};
```

**What `hashDay` does:** it turns a date string like `"2026-03-08"` into a plain number by summing the ASCII value of each character (`charCodeAt`). The same date always gives the same number — that's the whole trick. No randomness, no server, no database entry per day.

> **New concept: Determinism.** A function is "deterministic" when the same input always produces the same output. `hashDay("2026-03-08")` will return the exact same number every single time you call it, on any computer, for any user. This is the opposite of `Math.random()`. By using the date as input, you get a schedule that feels curated but requires zero maintenance.

**What `% affirmations.length` does:** the modulo (`%`) operator gives you the remainder after division. It's perfect for wrapping a big number into a small array index.

> **Mental model: the clock.** A 12-hour clock shows 1:00 after 13 hours, not 13:00 — the numbers wrap around. Modulo does the same thing: `847 % 5 = 2`, `848 % 5 = 3`, `852 % 5 = 2` (back again). The hash number might be 847, but there are only 5 affirmations, so you end up at index 2.

**What `?? lessons[0]` does:** the `??` is called the nullish coalescing operator. If `find()` returns `undefined` (because the `lessonId` didn't match anything), use `lessons[0]` as a fallback. Think of it as: "use this value, or if it's null/undefined, use that instead."

**`useMemo(() => getDailyPair(), [])` in App.tsx** — wrapping the call in `useMemo` with an empty `[]` dependency array means this runs exactly once when the component first loads and never again. Without it, React would recalculate the daily pair on every re-render. Not a big deal for something this lightweight, but it's good habit: if data doesn't change, don't recompute it.

---

## 3. State management in `App.tsx`

The whole app lives in one component — no Redux, no Zustand, just React's built-in `useState`. Each piece of state is one thing the UI needs to remember:

```ts
const [theme, setTheme] = useState<ThemeKey>("coquette-compiler");
const [darkMode, setDarkMode] = useState(false);
const [journalText, setJournalText] = useState("");
const [entries, setEntries] = useState<JournalEntry[]>([]);
const [claimedDay, setClaimedDay] = useState("");
const [generated, setGenerated] = useState<GeneratedContent | null>(null);
const [revision, setRevision] = useState<RevisionNote | null>(null);
```

Every `useState` returns two things: the current value and a function to update it. When you call the setter (`setTheme`, `setDarkMode`, etc.), React re-renders the component with the new value. That's all React state is — variables that trigger a re-render when they change.

**Why `null` instead of `{}`?** The initial value for `generated` and `revision` is `null`, not an empty object. That's intentional. The UI checks `if (generated)` to decide whether to show AI content or static content. `null` is falsy (the check fails, show static). An empty object `{}` is truthy (the check passes, show broken AI content). `null` is the correct way to say "this doesn't exist yet."

### Derived values — computing instead of storing

Instead of adding more `useState` for every display value, the app computes them on the fly:

```ts
const displayAffirmation = generated?.affirmation ?? dailyPair.affirmation.text;
const displayMantra = generated?.mantra ?? dailyPair.affirmation.mantra;
```

`generated?.affirmation` uses optional chaining — if `generated` is `null`, this safely returns `undefined` instead of crashing. Then `??` picks the static fallback. Read it as: "show the AI version if it exists, otherwise show the curated version."

This is cheaper than storing `displayAffirmation` in its own `useState`. If you did that, you'd have to remember to update it every time `generated` or `dailyPair` changed. Computing it inline means it's always correct by definition — one less thing to keep in sync.

---

## 4. Persistence with `localStorage`

The journal and preferences need to survive a page refresh without a database. That's `localStorage`'s job.

### What is localStorage?

`localStorage` is a tiny key-value store built into every browser. Think of it as a sticky note your browser keeps for each website. You save with `setItem("key", value)` and read back with `getItem("key")`. Values persist even after the tab is closed — until the user clears their browser data.

It has real limitations: it only stores strings (so objects need `JSON.stringify`/`JSON.parse`), it's limited to ~5MB, and it's completely local — if the user switches browsers, it's gone. That's exactly the trade-off the app tells you about: *"Local-first. Your notes stay in this browser."* For a personal daily ritual, that's fine.

### Three `useEffect` hooks

**On mount** — the empty `[]` dependency array means "run once, right after the component first renders." This is where saved preferences are loaded:

```ts
useEffect(() => {
  const savedTheme = window.localStorage.getItem(storageKeys.theme) as ThemeKey | null;
  const savedJournal = window.localStorage.getItem(storageKeys.journal);
  // ... set state from saved values
}, []);
```

**On theme or dark mode change** — the `[theme, darkMode]` dependency array means "re-run whenever either of these changes." This saves the new values and applies the CSS classes to `document.body`:

```ts
useEffect(() => {
  const classes = [themes[theme].surfaceClass, darkMode ? "dark-mode" : ""].filter(Boolean);
  document.body.className = classes.join(" ");
  window.localStorage.setItem(storageKeys.theme, theme);
}, [theme, darkMode]);
```

`filter(Boolean)` removes falsy values — when `darkMode` is false, the empty string `""` gets filtered out so `body.className` doesn't get a stray space. The theme system works by swapping a CSS class on `body` — all the colour variables are scoped to class names like `body.theme-coquette` in `styles.css`.

---

## 5. The API backend

Everything above is pure frontend. Now for the part that powers the AI features.

The app has two backend files in `functions/api/` — these are **Cloudflare Functions**, which means they're deployed automatically alongside your static site on Cloudflare Pages. Any file in `functions/api/` becomes a live API endpoint at the matching URL, no server configuration needed.

- `functions/api/generate-daily.ts` → handles `POST /api/generate-daily`
- `functions/api/revision-note.ts` → handles `GET /api/revision-note`

Both call **Groq** — a fast AI inference service running Meta's Llama model — using a key stored in an environment variable.

### Why not just call the AI from React?

Your `GROQ_API_KEY` must never be in the browser. If you called Groq directly from React, anyone who opened DevTools → Network tab could see your key in the request headers and use it on your account. The backend function is the middleman: the browser asks your function, your function asks Groq, the key never leaves the server.

### What is a route?

A **route** is a URL + HTTP method combination that your backend listens for. Think of it as a menu of things your server can do:

| Method | URL | What it means |
|--------|-----|---------------|
| `GET` | `/api/revision-note` | "Give me a flashcard" |
| `POST` | `/api/generate-daily` | "Generate content, here's the data you need" |

**GET** = fetch something. **POST** = send data, get something back. (You'll also hear about **PUT** for updating and **DELETE** for removing. These four together are called **CRUD** — Create, Read, Update, Delete — the four basic operations of any data system.)

### Route 1: `POST /api/generate-daily`

The browser sends a POST request with a JSON body:

```json
{ "theme": "coquette-compiler", "topic": "confidence", "experienceLevel": "early-career" }
```

The Cloudflare Function reads it with `request.json()` — one line, no manual parsing needed:

```ts
const payload = await request.json().catch(() => ({}));
const body = {
  theme: typeof payload.theme === "string" ? payload.theme : "coquette-compiler",
  topic: typeof payload.topic === "string" ? payload.topic : "confidence",
  experienceLevel: typeof payload.experienceLevel === "string" ? payload.experienceLevel : "early-career"
};
```

The `.catch(() => ({}))` means: if the request body is malformed JSON, use an empty object and fall through to the defaults. Then the function calls Groq's API using `fetch`.

### Route 2: `GET /api/revision-note`

Instead of reading files from disk (which doesn't work in serverless environments), this route uses a pre-bundled JSON file — `notes/notes.json` — that was generated from your Markdown notes at build time:

```ts
import notesList from "../../notes/notes.json";

const chosen = notes[Math.floor(Math.random() * notes.length)];
```

`Math.floor(Math.random() * notes.length)` is the standard pattern for a random array index. `Math.random()` gives a decimal between 0 and 1. Multiply by the array length to get a decimal in range. `Math.floor` rounds down to a whole number. Result: a valid random index every time.

### How to make AI output reliable: structured prompting

You can't just ask an AI model "make me a flashcard" and pipe the response into your UI. The model might return a paragraph, a list, a haiku — you have no idea. The trick is to be extremely explicit about the shape you want:

```ts
const buildRevisionPrompt = (noteContent: string, noteFilename: string) => `
...your instructions...

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
- The code example should be 3 lines max, or null
- Make the tip catchy and sticky
`;
```

Telling the model exactly what to return — and adding `response_format: { type: "json_object" }` to the API request — locks the output to valid JSON. This technique is called **prompt engineering**: structuring your instructions to constrain what the model produces, so your code can reliably consume it.

### Parsing the response

Groq uses the same API format as OpenAI (they're compatible), so the response has this shape:

```ts
const data = await response.json();
const content = JSON.parse(data.choices[0].message.content);
```

`choices[0].message.content` is where the model's reply lives — a JSON string. `JSON.parse` turns it into a JavaScript object. Since we used `response_format: { type: "json_object" }`, the response is guaranteed to be valid JSON — no regex fallback needed.

---

## 6. Async: how the frontend calls the backend

### What async actually means

When your app calls an API, it has to wait — maybe 1 second, maybe 3. **Asynchronous** code means: "start this thing, and when it finishes, continue — but don't freeze everything in the meantime."

In JavaScript, `async/await` is how you write that clearly. Mark a function `async`, then use `await` in front of anything that takes time (like a `fetch` call). While the `await` is waiting, the browser stays responsive. The rest of the UI doesn't freeze.

Here's the full pattern from the AI remix button:

```ts
const generateWithGemini = async () => {
  setIsGenerating(true);     // flip the button to "Generating..."
  setGenerationError("");    // clear any previous error message

  try {
    const response = await fetch("/api/generate-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme,
        topic: dailyPair.affirmation.topic,
        experienceLevel: "early-career"
      })
    });

    const data = (await response.json()) as { content: GeneratedContent } | { error: string };

    if (!response.ok || !("content" in data)) {
      throw new Error("error" in data ? data.error : "Generation failed.");
    }

    setGenerated(data.content);  // swap the displayed content to the AI version
  } catch (error) {
    setGenerationError(error instanceof Error ? error.message : "Generation failed.");
  } finally {
    setIsGenerating(false);  // always flip the button back, success or fail
  }
};
```

The `try/catch/finally` structure is the standard way to handle async operations that might fail:

- **`try`** — attempt the thing. Any error inside jumps straight to `catch`.
- **`catch`** — handle the failure. Here it saves the error message to state so the UI can show it.
- **`finally`** — always runs, whether it succeeded or failed. This is critical: without it, a network error would leave `isGenerating` stuck as `true` and the button disabled forever.

**`"content" in data`** is TypeScript type narrowing. The response is typed as a union: it's either `{ content: ... }` or `{ error: string }`. Checking which key exists tells TypeScript which type it's dealing with in each branch — so it won't complain about accessing `.content` or `.error`.

---

## 7. Small details worth knowing

**`renderInlineMarkdown`** in `App.tsx` is a tiny hand-rolled parser. It splits text on `**...**` patterns and wraps matches in `<strong>`. This is why AI-generated bullets can include bold text without pulling in a full Markdown library. Sometimes one focused 10-line function beats adding a dependency.

**`formatDate`** appends `T00:00:00` before parsing: `new Date("2026-03-08T00:00:00")`. Without the time, `new Date("2026-03-08")` is interpreted as UTC midnight — which displays as the previous day for anyone in a timezone behind UTC. Always add a local time when constructing dates from date strings.

**`aria-hidden="true"`** on decorative elements (the sparkle divs, bow characters) tells screen readers to ignore them. They're visual flourishes, not information. Small accessibility detail, but it's what separates "it looks right" from "it works for everyone."

---

## What to try next

- **Add your own notes:** drop a `.md` file into the `notes/` folder, rebuild the notes JSON, and click "Draw a card" — your notes become flashcard material automatically.
- **Tweak the daily algorithm:** open `src/lib/daily.ts` and change the `hashDay` formula. Try multiplying the sum by a prime number and see how the daily rotation shifts.
- **Add a new theme:** add a key to the `themes` object in `content.ts`, add matching CSS variables scoped to a new body class in `styles.css`, and it appears in the settings panel immediately — `themeOrder` is built from `Object.keys(themes)` so there's nothing else to wire up.
- **Cache the AI result:** save `generated` to `localStorage` under a key that includes `dailyPair.dayKey`. On mount, check if a cached result exists for today before hitting the API. One change, zero unnecessary API calls.
