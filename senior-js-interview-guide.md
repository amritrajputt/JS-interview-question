# Senior JavaScript Interview — Complete Prep Guide

> Goal: cover concepts + tricky code so nothing surprises you. Read once, then run every code snippet yourself and predict the output before checking the answer.

---

## 1. Execution Context, Hoisting, Scope

### Core facts
- **Hoisting**: `var` and function declarations are hoisted (memory allocated in creation phase). `let`/`const` are hoisted too, but live in the **Temporal Dead Zone (TDZ)** until their declaration line executes.
- **Function declarations** are fully hoisted (name + body). **Function expressions / arrow functions** are not — only the variable binding is hoisted (as `undefined` for `var`).
- Each function call creates a new **Execution Context** with its own Variable Environment, Lexical Environment, and `this` binding.

### Tricky code #1
```js
console.log(a);
var a = 10;

console.log(b);
let b = 20;
```
**Output:** `undefined`, then `ReferenceError: Cannot access 'b' before initialization`
**Why:** `var` is hoisted and initialized to `undefined`. `let` is hoisted but stays in TDZ.

### Tricky code #2
```js
function foo() {
  console.log(x);
  var x = 1;
  function x() {}
  console.log(x);
}
foo();
```
**Output:** `[Function: x]`, then `1`
**Why:** Function declarations hoist above `var` declarations of the same name. The `var x` statement doesn't re-hoist (only assigns), so first log sees the function; second log sees the value after assignment.

### Tricky code #3 (classic closure-in-loop)
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// vs
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Output:** `3 3 3` then `0 1 2`
**Why:** `var` has function/global scope — one shared `i`, which is `3` by the time callbacks fire. `let` creates a **new binding per iteration**.

**Interviewer follow-up:** "Fix the `var` version without changing `var` to `let`."
```js
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

---

## 2. Closures

### Definition
A closure is a function bundled with references to its **lexical environment**, retained even after the outer function has returned.

### Tricky code — private counter
```js
function counter() {
  let count = 0;
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
  };
}
const c1 = counter();
const c2 = counter();
c1.inc(); c1.inc();
console.log(c1.get(), c2.get()); // 2 0
```
Each call to `counter()` creates a **new lexical environment** — closures are not shared across invocations.

### Memory leak gotcha
Closures keep their entire outer scope alive as long as *any* inner function referencing it exists — even unused variables. Be ready to discuss:
```js
function outer() {
  const bigData = new Array(1_000_000).fill('*');
  const smallFn = () => console.log('hi');
  return smallFn; // bigData is NOT garbage collected in older engines
                  // (V8 today is smart enough to drop unused refs, but be ready to explain the concept)
}
```

---

## 3. `this` Binding

### The 4 rules (in precedence order)
1. `new` binding — `this` = newly created object
2. Explicit binding — `call`/`apply`/`bind`
3. Implicit binding — `obj.method()` → `this` = `obj`
4. Default binding — plain function call → `this` = `undefined` (strict) or `global/window`

Arrow functions have **no own `this`** — they inherit it lexically from the enclosing scope at creation time, and it can never be reassigned by `call`/`apply`/`bind`.

### Tricky code
```js
const obj = {
  name: 'Alice',
  regular: function () {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  },
  nested: function () {
    const inner = () => console.log(this.name);
    inner();
  },
};
obj.regular();  // Alice
obj.arrow();    // undefined (this = outer scope, e.g. window/module)
obj.nested();   // Alice (arrow inherits `this` from `nested`)
```

### Tricky code — losing `this`
```js
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    setInterval(function () {
      this.seconds++;             // `this` is NOT the Timer instance here!
      console.log(this.seconds);
    }, 1000);
  }
}
```
**Fix options:** arrow function callback, `.bind(this)`, or store `const self = this`.

### `bind` tricky detail
```js
function greet() { console.log(this.name); }
const boundOnce = greet.bind({ name: 'A' });
const boundTwice = boundOnce.bind({ name: 'B' });
boundTwice(); // A — bind can't be re-bound once set
```

---

## 4. Prototypes & Inheritance

- Every object has an internal `[[Prototype]]` (`__proto__`), accessible via `Object.getPrototypeOf`.
- `class` is syntactic sugar over prototypal inheritance — no new inheritance model.
- Prototype chain lookups happen at **property access time**, not creation time.

### Tricky code
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () {
  console.log(`${this.name} makes a sound`);
};

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
  console.log(`${this.name} barks`);
};

const d = new Dog('Rex');
d.speak();                       // Rex barks
console.log(d instanceof Animal); // true
console.log(d.constructor === Dog); // true (only because we fixed it manually)
```
**Interview trap:** forgetting `Dog.prototype.constructor = Dog` — without it, `d.constructor` would incorrectly point to `Animal`.

### `Object.create(null)`
```js
const dict = Object.create(null);
dict.toString; // undefined — no Object.prototype chain, useful for pure hash maps
```

---

## 5. Event Loop, Microtasks & Macrotasks

**This is the #1 senior-level "tricky output" topic. Master it.**

Order of operations per tick:
1. Run current synchronous code (call stack empties)
2. Drain **entire microtask queue** (Promise `.then`, `queueMicrotask`, `MutationObserver`) — including microtasks *added during* microtask processing
3. Run **one** macrotask (`setTimeout`, `setInterval`, I/O, UI rendering)
4. Repeat

### Tricky code (the classic)
```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```
**Output:** `1 4 3 2`

### Harder version
```js
console.log('start');

setTimeout(() => console.log('timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('promise 1'))
  .then(() => console.log('promise 2'));

setTimeout(() => console.log('timeout 2'), 0);

Promise.resolve().then(() => console.log('promise 3'));

console.log('end');
```
**Output:** `start end promise 1 promise 3 promise 2 timeout 1 timeout 2`
**Why:** All chained `.then`s are microtasks — they ALL drain before any `setTimeout` macrotask runs, even ones chained after previously-resolved promises.

### async/await is just Promise sugar
```js
async function foo() {
  console.log('A');
  await null;
  console.log('B');
}
console.log('start');
foo();
console.log('end');
```
**Output:** `start A end B`
**Why:** Code before `await` runs synchronously. `await` always defers the rest of the function to a microtask, even `await null` / `await 1`.

### `async` function return value
```js
async function f() {
  return 1;
}
f().then(console.log); // 1 — f() always returns a Promise
```

---

## 6. Promises

### Key gotchas
- `Promise.all` rejects fast on the **first** rejection — other promises still run but their results are discarded.
- `Promise.allSettled` never short-circuits — waits for all, gives `{status, value|reason}` per item.
- `Promise.race` resolves/rejects with whichever settles first (fulfilled OR rejected).
- `Promise.any` resolves with the first fulfillment, rejects only if **all** reject (`AggregateError`).
- A `.then()` handler that throws produces a **rejected** promise, not an uncaught exception.

### Tricky code
```js
Promise.resolve(1)
  .then((val) => { throw new Error('fail'); })
  .catch((err) => { console.log('caught', err.message); return 42; })
  .then((val) => console.log('next', val));
// caught fail
// next 42
```
Errors propagate down the chain until a `.catch` handles them; execution then continues normally from that point.

### Unhandled rejection trap
```js
async function risky() {
  throw new Error('boom');
}
risky(); // UnhandledPromiseRejection if not awaited/caught
```

### Promise constructor executes synchronously
```js
new Promise((resolve) => {
  console.log('executor runs immediately');
  resolve();
}).then(() => console.log('then runs later'));
console.log('after promise creation');
```
**Output:** `executor runs immediately`, `after promise creation`, `then runs later`

---

## 7. Type Coercion & Equality

### Must-know table
```js
[] + []            // ""
[] + {}            // "[object Object]"
{} + []            // 0 (in a statement context — {} parsed as empty block!)
true + true        // 2
'5' + 3             // "53"
'5' - 3             // 2
null == undefined   // true
null === undefined  // false
NaN === NaN         // false
[1,2] == '1,2'      // true (array → string coercion)
0 == '0'            // true
0 == ''              // true
0 == []              // true
'' == []             // true
false == []          // true (both coerce to 0)
false == '0'         // true
```

### `typeof` gotchas
```js
typeof null            // "object" (historic JS bug, never fixed)
typeof NaN              // "number"
typeof function(){}     // "function"
typeof []               // "object"
typeof Symbol()         // "symbol"
typeof undeclaredVar    // "undefined" (no ReferenceError!)
```

### `Object.is` vs `===`
```js
Object.is(NaN, NaN);    // true (=== gives false)
Object.is(0, -0);       // false (=== gives true)
```

---

## 8. Arrays & Objects — Edge Cases

### Sparse array traps
```js
const arr = [1, , 3];    // length 3, index 1 is a "hole"
arr.forEach(x => console.log(x)); // logs 1, 3 (skips holes)
arr.map(x => x * 2);              // [2, <1 empty item>, 6]
console.log(arr[1]);              // undefined
```

### `sort()` default behavior
```js
[10, 1, 21, 2].sort(); // [1, 10, 2, 21] — default sort is LEXICOGRAPHIC (string) sort!
```
Always pass a comparator for numbers: `.sort((a, b) => a - b)`.

### Mutating vs non-mutating methods (senior interviewers love this)
- **Mutating:** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`
- **Non-mutating:** `map`, `filter`, `slice`, `concat`, `reduce`, `flat`, `flatMap`

### Object key ordering
```js
const o = { b: 1, 2: 'two', a: 3, 1: 'one' };
console.log(Object.keys(o)); // ['1', '2', 'b', 'a']
```
**Rule:** Integer-like keys are iterated first in ascending numeric order, then string keys in insertion order, then Symbols.

### Shallow copy pitfalls
```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.nested.b = 99;
console.log(original.nested.b); // 99 — spread is shallow!
```

---

## 9. Advanced Function Concepts

### Currying
```js
const curry = (fn) => {
  const curried = (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...more) => curried(...args, ...more);
  return curried;
};
const add3 = (a, b, c) => a + b + c;
const curriedAdd = curry(add3);
console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6
```

### Debounce vs Throttle (write from memory — asked constantly)
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```
**Debounce** = wait for pause in events (search-as-you-type). **Throttle** = run at most once per interval (scroll handlers).

### Memoization
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### IIFE + module pattern
```js
const Counter = (function () {
  let count = 0;
  return {
    increment() { return ++count; },
  };
})();
```

---

## 10. `call`, `apply`, `bind` — Implement from scratch

Interviewers frequently ask you to polyfill these.

```js
Function.prototype.myCall = function (context = globalThis, ...args) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myApply = function (context = globalThis, args = []) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};
```

---

## 11. Generators & Iterators

```js
function* gen() {
  const x = yield 1;
  const y = yield x + 1;
  return x + y;
}
const it = gen();
console.log(it.next());    // { value: 1, done: false }
console.log(it.next(10));  // { value: 11, done: false }
console.log(it.next(20));  // { value: 30, done: true }
```
**Key idea:** value passed to `.next()` becomes the result of the *previous* `yield` expression.

### Custom iterable
```js
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let current = this.from, last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
console.log([...range]); // [1, 2, 3]
```

---

## 12. Symbols, WeakMap, WeakSet

- `WeakMap`/`WeakSet` keys must be objects and are **not enumerable** — used for memory-safe metadata (e.g., private data, DOM node caches) since entries are garbage-collected when the key object is no longer referenced elsewhere.
- Regular `Map`/`Set` prevent garbage collection of keys; `WeakMap`/`WeakSet` don't.

```js
const privateData = new WeakMap();
class Person {
  constructor(name) { privateData.set(this, { name }); }
  getName() { return privateData.get(this).name; }
}
```

---

## 13. `var` vs `let` vs `const` — Full comparison

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block | block |
| Hoisting | yes, initialized `undefined` | yes, TDZ | yes, TDZ |
| Redeclare | allowed | error | error |
| Reassign | yes | yes | no (binding, not value) |

```js
const obj = { a: 1 };
obj.a = 2;       // fine — object contents are mutable
obj = {};        // TypeError — reassigning the binding
```

---

## 14. Optional Chaining, Nullish Coalescing

```js
const a = { b: { c: 0 } };
console.log(a?.b?.c ?? 'default'); // 0 (NOT 'default' — 0 is not nullish!)
console.log(a?.x?.y ?? 'default'); // 'default'

// Common trap: || vs ??
const count = 0;
console.log(count || 10); // 10 (wrong if 0 is valid!)
console.log(count ?? 10); // 0  (correct)
```

---

## 15. Modules

- ES Modules are **live bindings** — importing a variable reflects future changes to it. CommonJS `require` copies the value at import time (for primitives).
```js
// counter.mjs
export let count = 0;
export function inc() { count++; }

// main.mjs
import { count, inc } from './counter.mjs';
console.log(count); // 0
inc();
console.log(count); // 1 — live binding updates!
```
- ESM is parsed statically (imports hoisted, tree-shakeable); CommonJS is dynamic/runtime.

---

## 16. Classes — Deep Cuts

```js
class Base {
  #privateField = 10;         // truly private, not just convention
  static #instances = 0;
  static count() { return Base.#instances; }
  constructor() { Base.#instances++; }
  getPrivate() { return this.#privateField; }
}
```
- Class methods are **non-enumerable** by default (unlike prototype methods added manually).
- Class declarations are **not hoisted** into usable state (TDZ applies) — unlike function declarations.
- `super` in methods refers to the parent's prototype methods; in constructor, calls the parent constructor and must run before using `this`.

```js
class A {
  constructor() { console.log(new.target.name); }
}
class B extends A {}
new B(); // "B" — new.target reflects the actually-invoked constructor
```

---

## 17. Common "Predict the Output" Grab Bag

```js
// 1
console.log([1, 2, 3] + [4, 5, 6]);
// "1,2,34,5,6"

// 2
console.log(typeof typeof 1);
// "string" (typeof 1 → "number", typeof "number" → "string")

// 3
let x = { a: 1 };
let y = x;
x.a = 2;
console.log(y.a); // 2 (objects are reference types)

// 4
function Foo() { return {}; }
console.log(new Foo() instanceof Foo); // false — explicit object return overrides `this`

function Bar() { return 5; }
console.log(new Bar() instanceof Bar); // true — primitive returns are ignored

// 5
console.log(0.1 + 0.2 === 0.3); // false (floating point precision)
console.log(0.1 + 0.2);          // 0.30000000000000004

// 6
console.log([1,2,3].map(parseInt));
// [1, NaN, NaN] — map passes (element, index, array); parseInt(el, index) uses index as radix!

// 7
const arr = [1, 2, 3];
delete arr[1];
console.log(arr);        // [1, <empty>, 3]
console.log(arr.length); // 3 — delete doesn't reindex or shrink

// 8
console.log(1 < 2 < 3);  // true  → (1<2)=true→1, 1<3 → true
console.log(3 > 2 > 1);  // false → (3>2)=true→1, 1>1 → false

// 9
let a = [1, 2, 3];
let [x1, ...rest] = a;
console.log(rest); // [2, 3]

// 10
console.log(typeof NaN === 'number'); // true
console.log(Number.isNaN('foo'));      // false (strict, no coercion)
console.log(isNaN('foo'));             // true (coerces 'foo' to NaN first)
```

### Explain `[1,2,3].map(parseInt)` fully — favorite senior trap
`map` calls `callback(element, index, array)`. `parseInt(string, radix)`.
- `parseInt(1, 0)` → radix 0 defaults to 10 → `1`
- `parseInt(2, 1)` → radix 1 is invalid → `NaN`
- `parseInt(3, 2)` → binary, but "3" isn't valid in base 2 → `NaN`

---

## 18. Design Patterns You Should Be Able to Discuss

- **Module pattern** (IIFE, closures for privacy)
- **Singleton** (single shared instance, e.g. config object)
- **Observer/Pub-Sub** (event emitters, RxJS-style streams)
- **Factory** (function that returns objects without `new`)
- **Decorator** (wrapping functions/classes to add behavior — higher-order functions)
- **Proxy pattern** (native `Proxy` object for intercepting get/set/etc.)

```js
const handler = {
  get(target, prop) {
    console.log(`Reading ${prop}`);
    return prop in target ? target[prop] : 37;
  },
};
const p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // "Reading a" 1, "Reading b" 37
```

---

## 19. Performance & Memory

- **Garbage collection**: mark-and-sweep algorithm; objects unreachable from roots get collected. Circular references are fine — GC uses reachability, not reference counting (mostly).
- **Memory leak sources**: forgotten timers/intervals, detached DOM references kept in JS variables, global variables, closures holding large unused scopes, event listeners never removed.
- **Debounce/throttle** for expensive handlers (scroll, resize, input).
- **Web Workers** for CPU-heavy work off the main thread.
- **requestAnimationFrame** vs `setTimeout` for animations — synced to repaint, avoids jank.

---

## 20. Common System/Coding Tasks Asked in Senior Interviews

Be ready to **write these live**, not just recognize them:

1. Deep clone an object (handle circular refs) — or explain `structuredClone`.
2. Implement `Promise.all` / `Promise.race` from scratch.
3. Flatten a nested array (recursive + iterative).
4. Implement `EventEmitter` (on/off/emit).
5. Implement a basic Pub/Sub system.
6. Write a LRU cache using `Map` (Map preserves insertion order — useful here).
7. Debounce/throttle (above).
8. Implement `curry`.
9. Deep equality check function.
10. Implement your own `Promise` class (then/resolve/reject/state machine).

### Example: LRU Cache
```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // move to "most recent"
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // evict oldest
    }
    this.cache.set(key, value);
  }
}
```

### Example: Promise.all from scratch
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;
        completed++;
        if (completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

### Example: deep clone with circular reference handling
```js
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], seen);
    }
  }
  return clone;
}
```

---

## 21. Behavioral / System-Design-Adjacent Questions (Senior Level)

Be ready to talk through, not just code:
- How would you structure state management in a large React/Vue app without a framework's help?
- How do you handle race conditions in concurrent async requests (e.g., stale API responses overwriting fresh ones)? → **Answer:** use request IDs/tokens, `AbortController` to cancel stale requests.
- How would you debug a memory leak in production? → Chrome DevTools heap snapshots, comparing snapshots over time, looking for detached DOM trees.
- Tradeoffs of microservices vs monolith on the frontend (micro-frontends).
- How do you ensure accessibility and performance at scale?
- Explain how you'd implement infinite scroll efficiently (virtualization, intersection observer).

---

## 22. Quick-Fire Rapid Answers (rehearse these out loud)

- **Event delegation**: attach one listener to a parent, use `event.target` to handle children — better performance for many dynamic elements.
- **`Array.isArray` vs `typeof`**: `typeof []` is `"object"`; must use `Array.isArray()`.
- **`==` vs `===`**: loose (coerces types) vs strict (no coercion) — always prefer `===` unless intentionally checking `null`/`undefined` together.
- **Pure function**: same input → same output, no side effects.
- **First-class functions**: functions can be assigned to variables, passed as args, returned from other functions.
- **Higher-order function**: takes and/or returns a function (`map`, `filter`, `reduce`).
- **`Array.prototype.reduce` can build objects, not just sums** — know how to write `groupBy` using `reduce`.
- **Tagged template literals**: `` tag`Hello ${name}` `` — function receives strings array + interpolated values separately (used by styled-components, i18n libs).
- **`structuredClone(obj)`**: native deep clone (2022+), handles circular refs, but not functions.
- **Async iteration**: `for await (const x of asyncIterable)`.

---

## 23. Last-Minute Checklist (night before)

- [ ] Can explain event loop with a live example, unprompted
- [ ] Can write debounce/throttle from memory
- [ ] Can explain `this` in 4 binding scenarios with code
- [ ] Can explain closures with the loop `var`/`let` example
- [ ] Know the difference between microtask and macrotask queues
- [ ] Can write `Promise.all` polyfill
- [ ] Can explain prototypal inheritance and `class` sugar
- [ ] Know coercion gotchas (`[] + []`, `0 == []`, `NaN === NaN`)
- [ ] Can implement `call`/`apply`/`bind` polyfills
- [ ] Comfortable discussing memory leaks and how to find them
- [ ] Can explain ESM vs CommonJS differences
- [ ] Ready with 2-3 real project stories showing debugging/architecture decisions (behavioral component of "senior" interviews)

---

### Final tip
Senior interviews weight **explaining your reasoning out loud** as much as the correct answer. When you hit a tricky output question, narrate your thought process (execution context → call stack → microtask/macrotask → coercion rules) — that's what signals seniority, not just memorized answers.

Good luck — you've got this.
