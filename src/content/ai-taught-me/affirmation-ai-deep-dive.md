---
title: "How That Tech Girl Actually Works: A Code Walkthrough"
date: "2026-03-07"
description: "A file-by-file deep dive into the React + Vite PWA you vibe-coded"
tags: ["react", "vite", "ai"]
---

*Disclosure: This blog post was written by an AI, with human guidance on structure and tone.*

---

# How That Tech Girl Actually Works: A Code Walkthrough

This post walks through a real React + Vite PWA called That Tech Girl — a daily affirmation app for women in tech. We'll go file-by-file through the codebase and, along the way, pull out the broader programming concepts that apply far beyond this project.

**What we'll cover:**

- How the app generates a new affirmation every day without a database (and what determinism teaches us about caching and testing)
- Managing state with React hooks — and the difference between stored and derived state
- Persisting data locally with `localStorage` and the rise of local-first architecture
- Building an API backend with serverless functions — and why secrets never belong in frontend code
- Calling AI APIs asynchronously with proper error handling
- Theming with CSS custom properties — the simplest approach that works

Each section starts with the actual code, then zooms out to the pattern it illustrates. Whether you're building your own project or just curious how these pieces fit together, there's something here.

---

## What the app is and what it does

**[That Tech Girl](https://that-tech-girl-app.pages.dev/)** is a PWA (Progressive Web App) — a website that behaves more like a native app — built for women in tech who want a daily dose of confidence alongside a practical skill. Think of it as a pocket ritual: affirmations paired with real coding knowledge, wrapped in a deliberately over-the-top aesthetic complete with bows, pastels, and sparkle animations.

Here's what happens when you open it:

**Daily ritual card** — The hero of the page. Every day surfaces a new affirmation paired with a matching tech lesson. The pairing is deterministic: the same date always produces the same affirmation.

**AI remix** — Hit the button and the app sends your current theme and topic to an AI-powered backend, which generates a fresh affirmation and lesson.

**Revision flashcards** — "Draw a card" calls a backend route that picks one of your bundled Markdown notes, passes it to an AI model, and gets back a flashcard.

**Win journal** — A local-only text area where you log what you shipped. Nothing leaves the browser. Entries persist in `localStorage`.

**Themes** — Five palettes you can switch between at any time. Your choice is saved.

Now let's look at how all of that is actually built — and why those choices matter beyond this one app.

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

### Why types matter (beyond this app)

These `type` declarations are TypeScript telling your editor "here's the exact shape of this data." If you later try to write `affirmation.mantrea` (a typo), TypeScript flags it immediately.

This is **type safety** — one of the most impactful advances in modern software engineering. Languages like Rust have made it famous, but TypeScript brought it to the JavaScript ecosystem. The idea: catch mistakes at write-time, not at runtime when a user sees a broken screen.

The same principle applies everywhere: databases have schemas, API responses have shapes, forms have validation. TypeScript just makes that checking happen in your editor, before you ever deploy.

### Data relationships

The `lessonId` on an affirmation works like a link between two tables — exactly like a database join, but entirely in memory. Each affirmation points to exactly one lesson by ID.

This is a **foreign key** pattern, one of the most fundamental concepts in data modelling. Whether you're working with SQL, a NoSQL database, or just JavaScript objects, the idea is the same: connect related data by ID rather than duplicating it.

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

### Determinism: why it matters

**What `hashDay` does:** it turns a date string like `"2026-03-08"` into a plain number by summing the ASCII value of each character.

> **New concept: Determinism.** A function is "deterministic" when the same input always produces the same output. `hashDay("2026-03-08")` will return the exact same number every single time you call it, on any computer, for any user. This is the opposite of `Math.random()`.

Determinism is foundational to software:

- **Caching** — If you know the same input always gives the same output, you can cache the result forever. Every CDN, every API, every database uses this.
- **Testing** — If a function is deterministic, you can write a test that checks: given input X, expect output Y. Every time. No flaky tests.
- **Reproducibility** — When something breaks, being able to replay the exact same conditions is debugging 101. Determinism gives you that.
- **Distributed systems** — Two servers processing the same request should produce the same result. That's how Bitcoin, blockchain, and consensus algorithms work.

By using the date as input, you get a schedule that feels curated but requires zero maintenance. No database, no cron job, no deployment on new content.

### The modulo operator

**What `% affirmations.length` does:** the modulo (`%`) operator gives you the remainder after division. It's perfect for wrapping a big number into a small array index.

> **Mental model: the clock.** A 12-hour clock shows 1:00 after 13 hours, not 13:00 — the numbers wrap around. Modulo does the same thing: `847 % 5 = 2`, `848 % 5 = 3`, `852 % 5 = 2` (back again).

This pattern is everywhere:

- **Round-robin load balancing** — Distribute requests across servers: `serverIndex = requestId % serverCount`
- **Pagination** — Wrap around to page 1 when you hit the end: `page = (currentPage + 1) % totalPages`
- **Color cycling** — Cycle through a palette: `color = palette[i % palette.length]`
- **Game development** — Wrap player positions: `x = (x + velocity) % screenWidth`

### Nullish coalescing

**What `?? lessons[0]` does:** the `??` is called the nullish coalescing operator. If `find()` returns `undefined`, use `lessons[0]` as a fallback.

This is **defensive programming** — writing code that handles unexpected situations gracefully instead of crashing. It's the same idea as:

- Default parameters in functions
- Fallback values for API responses
- "Contact support" messages when data is missing

`useMemo(() => getDailyPair(), [])` — wrapping the call in `useMemo` with an empty `[]` dependency array means this runs exactly once when the component first loads and never again.

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

### What state actually is

Every `useState` returns two things: the current value and a function to update it. When you call the setter, React re-renders the component with the new value.

This is the core of **reactive programming** — a paradigm where the UI automatically updates when data changes. React pioneered this for the web, but the same pattern exists in:

- **Vue** — reactive data bindings
- **Svelte** — compiler-based reactivity
- **Flutter** — setState that rebuilds widgets
- **Elm** — The Elm Architecture that inspired Redux

The mental model: state is the source of truth, UI is a reflection of that state. When state changes, UI re-renders.

### Why `null` instead of `{}`?

The initial value for `generated` and `revision` is `null`, not an empty object. That's intentional. The UI checks `if (generated)` to decide whether to show AI content or static content.

This is a common pattern called the **Maybe pattern** or **Optional type**:

- `null` = "this doesn't exist yet"
- `{}` = "this exists and is empty"

In TypeScript, `null` is falsy, `{}` is truthy. In languages like Rust, this is explicit with `Option<T>`. In Haskell, it's `Maybe a`. The idea: distinguish between "nothing" and "something (even if empty)."

### Derived values — computing instead of storing

```ts
const displayAffirmation = generated?.affirmation ?? dailyPair.affirmation.text;
const displayMantra = generated?.mantra ?? dailyPair.affirmation.mantra;
```

`generated?.affirmation` uses optional chaining — if `generated` is `null`, this safely returns `undefined`. Then `??` picks the static fallback.

This is **computed state** vs **stored state**:

- **Stored state** — something that changes over time and needs to be remembered (user input, API responses)
- **Derived state** — something that can be calculated from other state (this display value)

The rule: if you can derive it, derive it. One less thing to keep in sync.

---

## 4. Persistence with `localStorage`

The journal and preferences need to survive a page refresh without a database. That's `localStorage`'s job.

### What is localStorage?

`localStorage` is a tiny key-value store built into every browser. Think of it as a sticky note your browser keeps for each website. You save with `setItem("key", value)` and read back with `getItem("key")`.

### Local-first architecture

This app uses a **local-first** approach — data lives on the device first, optionally syncs later. This is a growing trend:

- **Notion** — Works offline, syncs when online
- **Obsidian** — Local Markdown files, no cloud required
- **Progressive Web Apps** — Service workers cache everything
- **Linear** — Local-first, then cloud sync

The trade-off: simpler (no backend needed for basic features), works offline, privacy-friendly. But: data lives on one device, harder to share across devices without sync infrastructure.

`localStorage` specifically has limitations:

- Only stores strings (objects need `JSON.stringify`/`JSON.parse`)
- Limited to ~5MB
- Completely local — if the user switches browsers, it's gone
- Synchronous (blocks the main thread for large reads/writes)

For a personal daily ritual app, this is fine. For something with user accounts and multi-device sync, you'd reach for IndexedDB, or a sync solution like Firebase, Supabase, or ElectricSQL.

### Three `useEffect` hooks

**On mount** — the empty `[]` dependency array means "run once, right after the component first renders." This is where saved preferences are loaded:

```ts
useEffect(() => {
  const savedTheme = window.localStorage.getItem(storageKeys.theme) as ThemeKey | null;
  const savedJournal = window.localStorage.getItem(storageKeys.journal);
  // ... set state from saved values
}, []);
```

**On theme or dark mode change** — the `[theme, darkMode]` dependency array means "re-run whenever either of these changes." This saves the new values and applies CSS classes to `document.body`:

```ts
useEffect(() => {
  const classes = [themes[theme].surfaceClass, darkMode ? "dark-mode" : ""].filter(Boolean);
  document.body.className = classes.join(" ");
  window.localStorage.setItem(storageKeys.theme, theme);
}, [theme, darkMode]);
```

`filter(Boolean)` removes falsy values — when `darkMode` is false, the empty string gets filtered out.

### Why CSS classes for theming?

The theme system works by swapping a CSS class on `body` — all the colour variables are scoped to class names like `body.theme-coquette`.

This is **CSS custom properties** (variables), one of the most powerful features of modern CSS:

```css
:root {
  --accent: #ff4db8;
}

body.theme-midnight {
  --accent: #d400ff;
}

button {
  background: var(--accent);
}
```

One CSS rule, multiple themes. No JavaScript library needed. Compare this to older approaches:

- **2010**: jQuery plugins that manipulated individual style properties
- **2015**: CSS-in-JS libraries (Styled Components, Emotion)
- **2020**: Tailwind with CSS variables for theming
- **Now**: Native CSS custom properties, framework-agnostic

The lesson: sometimes the simplest solution (CSS variables) beats the most complex library.

---

## 5. The API backend

Everything above is pure frontend. Now for the part that powers the AI features.

The app has two backend files in `functions/api/` — these are **Cloudflare Functions**, which means they're deployed automatically alongside your static site on Cloudflare Pages. Any file in `functions/api/` becomes a live API endpoint at the matching URL, no server configuration needed.

- `functions/api/generate-daily.ts` → handles `POST /api/generate-daily`
- `functions/api/revision-note.ts` → handles `GET /api/revision-note`

Both call **Groq** — a fast AI inference service running Meta's Llama model.

### Why not just call the AI from React?

Your `GROQ_API_KEY` must never be in the browser. If you called Groq directly from React, anyone who opened DevTools → Network tab could see your key in the request headers and use it on your account.

This is **security by default**: anything that must stay secret lives on the server. The backend function is the middleman: the browser asks your function, your function asks Groq, the key never leaves the server.

This pattern is universal:

- **API keys** — Never in frontend code
- **Database credentials** — Environment variables on the server only
- **OAuth secrets** — Exchanged on the backend, tokens passed to frontend
- **Payment processing** — Stripe/PayPal keys stay server-side

The frontend is always visible to the user. The backend is your trusted environment.

### Serverless functions

Cloudflare Functions are **serverless** — you write code, deploy, and don't think about servers. This is a massive shift in how we build:

- **Traditional server** — You provision a machine, keep it running, handle scaling
- **Serverless** — You write a function, it runs when called, scales automatically, you pay per request

Same idea as AWS Lambda, Vercel API Routes, Netlify Functions. The backend is now code, not infrastructure.

### What is a route?

A **route** is a URL + HTTP method combination that your backend listens for:

| Method | URL | What it means |
|--------|-----|---------------|
| `GET` | `/api/revision-note` | "Give me a flashcard" |
| `POST` | `/api/generate-daily` | "Generate content, here's the data you need" |

**GET** = fetch something. **POST** = send data, get something back.

(You'll also hear about **PUT** for updating and **DELETE** for removing. These four together are called **CRUD** — Create, Read, Update, Delete — the four basic operations of any data system.)

### Route 1: `POST /api/generate-daily`

The browser sends a POST request with a JSON body:

```json
{ "theme": "coquette-compiler", "topic": "confidence", "experienceLevel": "early-career" }
```

The Cloudflare Function reads it with `request.json()`:

```ts
const payload = await request.json().catch(() => ({}));
const body = {
  theme: typeof payload.theme === "string" ? payload.theme : "coquette-compiler",
  topic: typeof payload.topic === "string" ? payload.topic : "confidence",
  experienceLevel: typeof payload.experienceLevel === "string" ? payload.experienceLevel : "early-career"
};
```

The `.catch(() => ({}))` means: if the request body is malformed JSON, use an empty object and fall through to the defaults. This is **defensive input handling** — never trust that the client sent what you expect.

### Route 2: `GET /api/revision-note`

Instead of reading files from disk (which doesn't work in serverless environments), this route uses a pre-bundled JSON file:

```ts
import notesList from "../../notes/notes.json";

const chosen = notes[Math.floor(Math.random() * notes.length)];
```

`Math.floor(Math.random() * notes.length)` is the standard pattern for a random array index.

### Structured prompting

You can't just ask an AI model "make me a flashcard" and pipe the response into your UI. The model might return a paragraph, a list, a haiku. The trick is to be extremely explicit:

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

This is **prompt engineering**: structuring your instructions to constrain what the model produces, so your code can reliably consume it.

With `response_format: { type: "json_object" }`, the response is guaranteed to be valid JSON. This technique is essential when building AI-powered features — your code needs to know what to expect.

---

## 6. Async: how the frontend calls the backend

### What async actually means

When your app calls an API, it has to wait — maybe 1 second, maybe 3. **Asynchronous** code means: "start this thing, and when it finishes, continue — but don't freeze everything in the meantime."

In JavaScript, `async/await` is how you write that clearly. Mark a function `async`, then use `await` in front of anything that takes time.

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

### The try/catch/finally pattern

- **`try`** — attempt the thing. Any error inside jumps straight to `catch`.
- **`catch`** — handle the failure. Here it saves the error message to state so the UI can show it.
- **`finally`** — always runs, whether it succeeded or failed. This is critical: without it, a network error would leave `isGenerating` stuck as `true` and the button disabled forever.

This pattern is everywhere in async programming. The web is asynchronous by nature — network calls, file reads, timers, user input all happen independently of your code's execution. Understanding `async/await` and `try/catch/finally` is fundamental to modern JavaScript.

---

## 7. Small details worth knowing

**`renderInlineMarkdown`** in `App.tsx` is a tiny hand-rolled parser. It splits text on `**...**` patterns and wraps matches in `<strong>`. This is why AI-generated bullets can include bold text without pulling in a full Markdown library.

Sometimes one focused 10-line function beats adding a dependency. This is the **primitive obsession** anti-pattern in reverse: don't reach for a library when a simple function solves the problem.

**`formatDate`** appends `T00:00:00` before parsing. Without the time, `new Date("2026-03-08")` is interpreted as UTC midnight — which displays as the previous day for anyone in a timezone behind UTC. Always add a local time when constructing dates from date strings.

**`aria-hidden="true"`** on decorative elements tells screen readers to ignore them. Accessibility isn't a feature — it's a requirement. Small details like this separate "it looks right" from "it works for everyone."

---

## What to try next

- **Add your own notes:** drop a `.md` file into the `notes/` folder, rebuild the notes JSON, and click "Draw a card" — your notes become flashcard material automatically.

- **Tweak the daily algorithm:** open `src/lib/daily.ts` and change the `hashDay` formula. Try multiplying the sum by a prime number and see how the daily rotation shifts.

- **Add a new theme:** add a key to the `themes` object in `content.ts`, add matching CSS variables scoped to a new body class in `styles.css`, and it appears in the settings panel immediately.

- **Cache the AI result:** save `generated` to `localStorage` under a key that includes `dailyPair.dayKey`. On mount, check if a cached result exists for today before hitting the API. One change, zero unnecessary API calls.
