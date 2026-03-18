---
trigger: glob
globs: "**/*.{test,spec}.ts"
description: "Testing philosophy, file organization, test beds, and MSW mocking guidelines."
applyTo: "**/*.{test,spec}.ts"
---

# Testing Guidelines

## Framework

Vitest + `@testing-library/svelte` in jsdom environment.

## File Organization

- **Colocated tests**: Place `*.spec.ts` or `*.test.ts` next to the source file being tested.
- **Test beds**: `test/beds/` has factories for queries, stores, and component renders.
- **Mocks**: MSW for request mocking (`src/mocks/`), environment mocks in `test/mocks/`.
- **Setup**: `vitest-setup.ts` initializes MSW, mocks browser APIs (IntersectionObserver, matchMedia, localStorage, etc.).

## Running Tests

```bash
deno task client:test    # from project root
vitest                   # from projects/client/
```

## Testing Philosophy

- **Test pure functions**: Focus testing on business logic and data transformations.
- **Test behavior, not implementation**: Tests should verify what code does, not how it does it.
- Pure functions are easy to test without mocks.
- Side effects should be tested at integration level, not unit level.
- Use MSW to mock API responses rather than mocking fetch directly.
