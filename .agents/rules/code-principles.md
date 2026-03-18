---
trigger: glob
globs: "**"
description: "Functional programming, immutability, simplicity, and function design principles (Single Responsibility, Object Parameters, Dependency Injection)."
applyTo: "**"
---

# Code Principles

## Functional Programming

- **Write functional code**: Prefer pure functions that avoid side effects when possible.
  - Functions should return consistent output for the same input.
  - Minimize state mutation and favor immutable data structures.
  - Keep Svelte stores minimal; use `$derived()` for computed values.
- **Separation of Concerns**: Keep core logic pure and deterministic.
  - API calls, local storage, and DOM manipulation are side effects.
  - Pure functions should handle data transformation only.
  - Side effects should live in the outer layers (components, hooks, server functions).

## Immutability

- **Prefer `const` over `let`**: Use `const` whenever possible.
- Avoid reassigning variables.
- Use array methods like `map`, `filter`, and `reduce` instead of mutating loops.
- Use TypeScript's `readonly` types: `Readonly<T>`, `ReadonlyArray<T>`, `ReadonlyMap`, `ReadonlySet`.

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

- **Use guard clauses and early returns**: Check error conditions first and return early.
- Avoid deep nesting by handling edge cases at the start of functions.

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

- **No nested if statements**: Nested conditionals indicate poor architecture.
  - Refactor into separate functions with clear responsibilities.
  - Use guard clauses and early returns instead.
- **No abstraction leaks**: Ensure abstractions hide implementation details completely.
- **No "god functions"**: Each function should have a single, clear responsibility.

## Function Design

- **Single Responsibility Principle**: Each function should do one thing well.
- Function names should clearly describe what they do.
- When a function takes 3+ parameters, use a single object parameter.

**Bad:**
```typescript
fetchData(url, token, retry, timeout);
```

**Good:**
```typescript
fetchData({ url, token, retry, timeout });
```

## Dependency Injection

- **Pass dependencies as parameters**: Don't instantiate external services inside functions.
- Makes functions testable without mocking.
- Use interface types to define the shape of dependencies.

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

- **Keep it simple**: Simple code is maintainable code.
- Suggestions should be simple and functional with low visual complexity.
- Split up into smaller functions when needed.
- Favor readability over cleverness.
- If a solution feels complex, step back and reconsider the approach.

## Iteration Patterns

- **Prefer functional methods over imperative loops**: Use `map`, `filter`, `reduce`.
- Avoid mutable loop counters when possible.
