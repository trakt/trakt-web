---
trigger: glob
globs: '**'
description: 'Functional programming, immutability, simplicity, and function design principles (Single Responsibility, Object Parameters, Dependency Injection).'
applyTo: '**'
---

# Code Principles

## Functional Programming

- **Write functional code**: prefer pure functions, avoid side effects when
  possible.
  - Same input -> same output.
  - Minimize mutation; favor immutable data.
  - Keep Svelte stores minimal; use `$derived()` for computed values.
- **Separation of Concerns**: keep core logic pure and deterministic.
  - API calls, local storage, DOM manipulation = side effects.
  - Pure functions handle data transformation only.
  - Side effects live in outer layers (components, hooks, server functions).

## Immutability

- **Prefer `const` over `let`** whenever possible.
- Avoid reassigning variables.
- Use `map`, `filter`, `reduce` instead of mutating loops.
- Use TypeScript `readonly` types: `Readonly<T>`, `ReadonlyArray<T>`,
  `ReadonlyMap`, `ReadonlySet`.

**Bad:**

```typescript
let result = [];
for (let i = 0; i < items.length; i++) {
  result.push(transform(items[i]));
}
```

**Good:**

```typescript
const result = items.map(transform);
```

## Early Exits

- **Use guard clauses and early returns**: check error conditions first, return
  early.
- Avoid deep nesting; handle edge cases at function start.

**Bad:**

```typescript
function processData(data: Data | null) {
  if (data) {
    if (data.isValid) {
      if (data.hasPermission) {
        return transform(data);
      }
    }
  }
  return null;
}
```

**Good:**

```typescript
function processData(data: Data | null) {
  if (!data) return null;
  if (!data.isValid) return null;
  if (!data.hasPermission) return null;

  return transform(data);
}
```

## Code Smells to Avoid

- **No nested if statements**: nested conditionals signal poor architecture.
  - Refactor into separate functions with clear responsibilities.
  - Use guard clauses and early returns instead.
- **No abstraction leaks**: abstractions must hide implementation details fully.
- **No "god functions"**: each function has a single, clear responsibility.

## Function Design

- **Single Responsibility**: each function does one thing well.
- Function names describe what they do.
- 3+ parameters -> use a single object parameter.

**Bad:**

```typescript
fetchData(url, token, retry, timeout);
```

**Good:**

```typescript
fetchData({ url, token, retry, timeout });
```

## Dependency Injection

- **Pass dependencies as parameters**: don't instantiate external services
  inside functions.
- Makes functions testable without mocking.
- Use interface types for dependency shape.

**Bad:**

```typescript
export function fetchUser(id: string) {
  const api = new ApiClient();
  return api.get(`/users/${id}`);
}
```

**Good:**

```typescript
interface FetchUserParams {
  api: ApiClient;
  id: string;
}

export function fetchUser({ api, id }: FetchUserParams) {
  return api.get(`/users/${id}`);
}
```

## Simplicity

- **Keep it simple**: simple code is maintainable code.
- Suggestions should be simple, functional, low visual complexity.
- Split into smaller functions when needed.
- Favor readability over cleverness.
- If a solution feels complex, step back and reconsider.

## Iteration Patterns

- **Prefer functional methods over imperative loops**: `map`, `filter`,
  `reduce`.
- Avoid mutable loop counters when possible.

## Type Safety

- **Never use non-null assertion (`!`)**: handle `null`/`undefined` explicitly
  with optional chaining, nullish coalescing, or guard clauses.
- **Prefer `.at()` over `[]` for array access**: `array.at(0)` returns
  `T | undefined`, making the type accurate.
