---
applyTo: "**"
---
# Project Coding Standards

## Tech Stack
- This is a SvelteKit + TypeScript project, using Svelte 5 in runes mode.

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases.
- Use camelCase for variables, functions, and methods.
- Use ALL_CAPS for constants.

## Commit Standards
- **Follow Conventional Commits**: All commits must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - Use types: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, etc.
  - Example: `feat: add user profile component`
  - Example: `fix: correct date formatting in calendar view`

## Code Principles

### Functional Programming
- **Write functional code**: Prefer pure functions that avoid side effects when possible.
- Functions should return consistent output for the same input.
- Minimize state mutation and favor immutable data structures.
- Keep Svelte stores minimal; use `$derived()` for computed values.

### Immutability
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

### Early Exits
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

### Code Smells to Avoid
- **No nested if statements**: Nested conditionals indicate poor architecture.
  - Refactor into separate functions with clear responsibilities.
  - Use guard clauses and early returns instead.
- **No abstraction leaks**: Ensure abstractions hide implementation details completely.
- **No "god functions"**: Each function should have a single, clear responsibility.

### Function Design
- **Single Responsibility Principle**: Each function should do one thing well.
- Function names should clearly describe what they do.
- When a function takes 3+ parameters, use a single object parameter.
- Pass dependencies as parameters (dependency injection).

**Bad:**
```typescript
fetchData(url, token, retry, timeout);
```

**Good:**
```typescript
fetchData({ url, token, retry, timeout });
```

### Dependency Injection
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

### Separation of Concerns
- **Push side effects to the edges**: Keep core logic pure and deterministic.
- API calls, local storage, and DOM manipulation are side effects.
- Pure functions should handle data transformation only.
- Side effects should live in the outer layers (components, hooks, server functions).

### Simplicity
- **Keep it simple**: Simple code is maintainable code.
- Suggestions should be simple and functional.
- Suggestions should have a low visual complexity.
- Split up suggestions in smaller functions if need be.
- Suggestions should not be over-engineered.
- Favor readability over cleverness.
- If a solution feels complex, step back and reconsider the approach.

### Iteration Patterns
- **Prefer functional methods over imperative loops**: Use `map`, `filter`, `reduce`.
- Avoid mutable loop counters when possible.
- Use recursion for complex accumulation patterns.

### Type Safety
- Always use TypeScript with strict mode.
- No `any` types; use specific types or utility types.

## Svelte 5 Specific Guidelines

### Reactive State
- Use `$derived()` for computed values (they're cached).
- Minimize use of stores; prefer local reactive state with runes.
- Use early returns in `$derived()` expressions when appropriate.

### Component Structure
- Keep components focused and single-purpose.
- Extract complex logic into separate utility functions.
- Use snippets for reusable template fragments.
- Actions should handle DOM manipulation, not reactive statements.

## Summary

Key principles for clean, maintainable code:

1. ✅ Follow Conventional Commits
2. ✅ Write functional, pure code when possible
3. ✅ Avoid nested if statements (code smell)
4. ✅ Use early exits with guard clauses
5. ✅ Prefer `const` over `let` for immutability
6. ✅ Keep solutions simple and readable
7. ✅ Prevent abstraction leaks
8. ✅ Single Responsibility Principle for functions
9. ✅ Use dependency injection for testability
10. ✅ Push side effects to the edges
11. ✅ Use TypeScript readonly types
12. ✅ Use object parameters for functions with 3+ arguments
13. ✅ Prefer functional iteration over imperative loops
14. ✅ Use `$derived()` for computed values in Svelte
15. ✅ Keep components focused and single-purpose
