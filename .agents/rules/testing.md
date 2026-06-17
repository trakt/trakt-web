---
trigger: glob
globs: '**/*.{test,spec}.ts'
description: 'Testing philosophy, file organization, test beds, and MSW mocking guidelines.'
applyTo: '**/*.{test,spec}.ts'
---

# Testing Guidelines

## Framework

Vitest + `@testing-library/svelte` in jsdom environment.

## File Organization

- **Colocated tests**: place `*.spec.ts` or `*.test.ts` next to source file.
- **Test beds**: `test/beds/` has factories for queries, stores, component renders.
- **Mocks**: MSW for request mocking (`src/mocks/`); env mocks in `test/mocks/`.
- **Setup**: `vitest-setup.ts` initializes MSW, mocks browser APIs (IntersectionObserver, matchMedia, localStorage, etc.).

## Running Tests

```bash
deno task test:unit    # from projects/client/
vitest                 # from projects/client/
```

## Testing Philosophy

- **Test pure functions**: focus on business logic and data transformations.
- **Test behavior, not implementation**: verify what code does, not how.
- Pure functions are easy to test without mocks.
- Side effects belong at integration level, not unit.
- Use MSW to mock API responses rather than mocking fetch directly.

## Test Beds

Always use helpers in `test/beds/` instead of constructing underlying RxJS / Svelte machinery by hand.

### Queries & stores - `runQuery`

Use `runQuery` to await the first (or first matching) emission from any RxJS `Observable` returned by a `use*` hook or composable.

```ts
import { runQuery } from '$test/beds/query/runQuery.ts';

const result = await runQuery({
  factory: () => useMovie(slug).movie,
  waitFor: (value) => value?.overview !== '', // optional gate
  mapper: (value) => value?.data, // optional projection
});
```

### Standalone queries - `createTestBedQuery`

For testing `defineQuery` / `defineInfiniteQuery` outputs directly, wrap with `createTestBedQuery` (or `createTestBedInfiniteQuery`) before passing to `runQuery`.

```ts
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';

const result = await runQuery({
  factory: () => createTestBedQuery(streamingSourcesQuery({})),
  mapper: (response) => response?.data,
});
```

### Components - `renderComponent`

Use `renderComponent` (wraps `@testing-library/svelte`'s `render` via `ComponentTestBed`) when a component needs context providers from the test bed. Plain `render(...)` from `@testing-library/svelte` is acceptable for simple prop-driven components.

## MSW Mock Data Conventions

Mock files live in `src/mocks/` and follow a strict shape - preserve it when adding new fixtures.

```
src/mocks/
  server.ts                              # MSW server bootstrap
  handlers/{domain}.ts                   # http.get(...) handlers per domain
  data/
    {domain}/
      response/{Entity}ResponseMock.ts   # raw API response shape
      mapped/{Entity}MappedMock.ts       # post-mapper domain model shape
```

- `{domain}` may be a multi-segment path (e.g. `summary/episodes/silo`), not just a single folder; resulting in paths like `data/summary/episodes/silo/response/...`.
- **`response/`** mocks mirror raw API payload - used by MSW handlers.
- **`mapped/`** mocks mirror output of the corresponding `mapTo*` function - used as expected value in assertions.
- Handler URLs use `http://localhost/...` origin and match the SDK path.

```ts
// mocks/handlers/movies.ts
http.get(
  `http://localhost/movies/${MovieHereticResponseMock.ids.slug}`,
  () => HttpResponse.json(MovieHereticResponseMock),
);
```

## Describe / It Conventions

- Top-level `describe` labels the unit under test, optionally prefixed by kind: `describe('store: useMovie', ...)`, `describe('util: findRegionalIntl', ...)`, `describe('streamingSourcesQuery', ...)`.
- Nested `describe` blocks group by scenario (e.g. `'movie: Heretic (2024)'`, `'for shows'`).
- `it` titles read as sentences starting with `'should ...'`.

## Path Aliases (test-specific)

| Alias    | Use for                                        |
| -------- | ---------------------------------------------- |
| `$test`  | Test beds and helpers (`$test/beds/query/...`) |
| `$mocks` | Mock response & mapped fixtures, MSW handlers  |

Never import from `test/` or `src/mocks/` via relative paths.
