# React + Node Interview Prep — Priority Guide (Limited Time Version)

Time kam hai, so ye file **priority order** mein hai. Agar sirf 1-2 hours milein, sirf "TOP PRIORITY" section karo — ye highest-frequency asked cheezein hain full-stack rounds mein.

---

## ⭐ TOP PRIORITY (do this first, non-negotiable)

### 1. useEffect — dependency array + cleanup (asked almost every single time)

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(timer); // cleanup — runs before next effect & on unmount
}, [someDep]);
```
- No dependency array → runs after **every** render.
- `[]` → runs once after mount only.
- `[dep]` → runs on mount + whenever `dep` changes (shallow comparison).
- **Stale closure trap** (very commonly asked):
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // always logs 0 — stale closure!
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps → closure captures count=0 forever
}
```
**Fix:** use functional update `setCount(c => c + 1)`, or add `count` to deps, or use a `ref` to always read latest value.

### 2. Why is `key` important in lists? (they WILL ask)
- React uses `key` to identify which items changed/added/removed during reconciliation (diffing).
- Using array **index** as key is dangerous when list order can change (reordering, insertion, deletion) — causes wrong state association between DOM nodes and data, subtle bugs with uncontrolled inputs/component state.
- Use a stable unique ID from data, not index, unless list is static and never reorders.

### 3. Controlled vs Uncontrolled components
- Controlled: input value driven by React state (`value` + `onChange`) — single source of truth, easier validation.
- Uncontrolled: DOM holds its own state, accessed via `ref` (`useRef`) — less re-renders, good for simple forms/file inputs.

### 4. `useMemo` vs `useCallback` vs `React.memo`
- `useMemo(fn, deps)` → memoizes a **computed value**.
- `useCallback(fn, deps)` → memoizes a **function reference** (so child doesn't re-render unnecessarily if it relies on referential equality).
- `React.memo(Component)` → skips re-render if props are shallowly equal.
- **Trap:** `useCallback`/`useMemo` are performance optimizations, NOT correctness guarantees — overusing them can hurt more than help (extra comparisons). Know when NOT to use them.

### 5. Reconciliation & Virtual DOM (conceptual, always comes up)
- React builds a virtual DOM tree, diffs it against the previous tree (Fiber architecture allows this to be interruptible/priority-based), and computes minimal real DOM mutations.
- Fiber enables **concurrent rendering** — React can pause, abort, or prioritize rendering work (e.g., `startTransition`, `useDeferredValue` in React 18+).

### 6. Node event loop phases (rapid recall)
`timers → pending callbacks → idle/prepare → poll → check (setImmediate) → close callbacks`
- `process.nextTick()` queue drains **before** the Promise microtask queue, and both drain before moving to the next event loop phase.
```js
console.log("start");
setImmediate(() => console.log("setImmediate"));
setTimeout(() => console.log("setTimeout"), 0);
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
console.log("end");
// start, end, nextTick, promise, setTimeout, setImmediate (setTimeout vs setImmediate order can vary depending on context — mention this nuance)
```

### 7. REST API design + Express middleware pattern
```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // MUST call next() or request hangs
});

app.use((err, req, res, next) => { // error-handling middleware — 4 args, always last
  console.error(err.stack);
  res.status(500).json({ error: "Something broke" });
});
```
Know: middleware order matters, `next(err)` skips to error handlers, async route handlers need try/catch or a wrapper (since Express doesn't catch async errors automatically pre-v5).

```js
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

---

## 🔷 SECOND PRIORITY (very likely, do if time allows)

### React Hooks deep-dive
- `useReducer` — when to prefer over `useState` (complex state logic, multiple sub-values, next state depends on previous in complex ways).
- Custom hooks — just JS functions that call other hooks; convention `useXxx`; share logic not state (each call gets its own state).
- Rules of Hooks: only call at top level (not in loops/conditions), only from React functions — because React relies on **call order** to match hooks across renders.

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}
```

### Context API + performance trap
- `useContext` causes **all** consuming components to re-render when the context value changes — even if they only use part of it. Common trap: passing a new object literal as context value every render (`value={{a, b}}`) causes unnecessary re-renders. Fix: `useMemo` the context value.

### React rendering behavior gotcha
```jsx
function Parent() {
  const [count, setCount] = useState(0);
  console.log("Parent render");
  return <Child />;
}
// Child re-renders too by default when Parent re-renders,
// UNLESS Child is wrapped in React.memo AND its props haven't changed.
```

### Node: Streams & Buffers (if backend-heavy role)
- Readable/Writable/Duplex/Transform streams — used for handling large files without loading everything into memory.
- Backpressure: `write()` returns `false` when internal buffer is full — should pause until `drain` event.

### CORS, and how you'd debug a CORS error live
- Preflight `OPTIONS` request for non-simple requests (custom headers, non-GET/POST, content-type json etc.)
- `Access-Control-Allow-Origin`, credentials flag (`Access-Control-Allow-Credentials` + `withCredentials`).

### JWT auth flow (if the role has auth work — matches your [[job-application-automation]] type work)
- Access token (short-lived) + refresh token (long-lived, stored httpOnly cookie ideally) pattern.
- Where NOT to store JWT (avoid localStorage for anything sensitive — XSS risk); httpOnly cookies mitigate that but open CSRF concerns (mitigate with SameSite + CSRF tokens).

---

## 🔹 IF TIME REMAINS — Nice-to-have polish

- **`React.lazy` + `Suspense`** for code splitting.
- **Error boundaries** — class components only (`componentDidCatch`, `getDerivedStateFromError`); no hook equivalent yet.
- **SSR vs CSR vs SSG** — one-liner differences if Next.js might come up.
- **Node clustering / worker_threads** for CPU-bound scaling.
- **Rate limiting / caching strategy** at API layer (Redis, in-memory LRU) — ties well into your GrowEasy/automation platform experience — be ready to talk about a REAL example from your own projects, interviewers love hearing genuine war stories over textbook answers.

---

## 🎯 60-Second Answers to Have Ready (rehearse out loud once)

1. "Walk me through what happens when a user clicks a button in a React app, from click to DOM update." → event handler → setState → React schedules re-render → Virtual DOM diff (Fiber reconciliation) → commit phase → real DOM update → browser paint.
2. "How would you optimize a slow list render of 10,000 items?" → virtualization (react-window/react-virtualized), memoization, keys, avoid inline function/object props.
3. "How do you handle race conditions in async React state updates (e.g., fast typing search)?" → debounce input, cancel/ignore stale requests (AbortController or a ref flag comparing latest request id).
4. "How does Node handle concurrency despite being single-threaded?" → non-blocking I/O via libuv thread pool + event loop; CPU-bound work should go to worker_threads/child_process, not block the main thread.

---

## Fastest possible run-through if you have < 30 minutes

Read only, in this order:
1. useEffect stale closure + cleanup (#1)
2. key prop reasoning (#2)
3. useMemo/useCallback/memo differences (#4)
4. Node event loop order with nextTick (#6)
5. The 4 "60-second answers" above — literally rehearse saying them once out loud

That alone covers a large share of what actually gets asked in a full-stack round. Good luck, Amrit — you've got this. Stay calm, think out loud, and it's fine to say "give me a second to think" — interviewers respect that far more than a rushed wrong guess.
