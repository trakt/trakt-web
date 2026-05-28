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

- **Colocated tests**: Place `*.spec.ts` or `*.test.ts` next to the source file
  being tested.
- **Test beds**: `test/beds/` has factories for queries, stores, and component
  renders.
- **Mocks**: MSW for request mocking (`src/mocks/`), environment mocks in
  `test/mocks/`.
- **Setup**: `vitest-setup.ts` initializes MSW, mocks browser APIs
  (IntersectionObserver, matchMedia, localStorage, etc.).

## Running Tests

```bash
deno task client:test    # from project root
vitest                   # from projects/client/
```

## Testing Philosophy

- **Test pure functions**: Focus testing on business logic and data
  transformations.
- **Test behavior, not implementation**: Tests should verify what code does, not
  how it does it.
- Pure functions are easy to test without mocks.
- Side effects should be tested at integration level, not unit level.
- Use MSW to mock API responses rather than mocking fetch directly.

## Test Beds

Always use the helpers in `test/beds/` instead of constructing the underlying
RxJS / Svelte machinery by hand.

### Queries & stores — `runQuery`

Use `runQuery` to await the first (or first matching) emission from any RxJS
`Observable` returned by a `use*` hook or composable.

```ts
import { runQuery } from '$test/beds/query/runQuery.ts';

const result = await runQuery({
  factory: () => useMovie(slug).movie,
  waitFor: (value) => value?.overview !== '', // optional gate
  mapper: (value) => value?.data, // optional projection
});
```

### Standalone queries — `createTestBedQuery`

For testing `defineQuery` / `defineInfiniteQuery` outputs directly, wrap them
with `createTestBedQuery` (or `createTestBedInfiniteQuery`) before passing to
`runQuery`.

```ts
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';

const result = await runQuery({
  factory: () => createTestBedQuery(streamingSourcesQuery({})),
  mapper: (response) => response?.data,
});
```

### Components — `renderComponent`

Use `renderComponent` (which wraps `@testing-library/svelte`'s `render` via a
`ComponentTestBed`) when a component needs context providers from the test bed.
Plain `render(...)` from `@testing-library/svelte` is acceptable for simple
prop-driven components.

## MSW Mock Data Conventions

Mock files live in `src/mocks/` and follow a strict shape — preserve it when
adding new fixtures.

```
src/mocks/
  server.ts                              # MSW server bootstrap
  handlers/{domain}.ts                   # http.get(...) handlers per domain
  data/
    {domain}/
      response/{Entity}ResponseMock.ts   # raw API response shape
      mapped/{Entity}MappedMock.ts       # post-mapper domain model shape
```

- **`response/`** mocks mirror the raw API payload — used by MSW handlers.
- **`mapped/`** mocks mirror the output of the corresponding `mapTo*` function —
  used as the expected value in assertions.
- Handler URLs use the `http://localhost/...` origin and match the SDK path.

```ts
// mocks/handlers/movies.ts
http.get(
  `http://localhost/movies/${MovieHereticResponseMock.ids.slug}`,
  () => HttpResponse.json(MovieHereticResponseMock),
);
```

## Describe / It Conventions

- Top-level `describe` labels the unit under test, optionally prefixed by kind:
  `describe('store: useMovie', ...)`, `describe('util: findRegionalIntl', ...)`,
  `describe('streamingSourcesQuery', ...)`.
- Nested `describe` blocks group by scenario (e.g. `'movie: Heretic (2024)'`,
  `'for shows'`).
- `it` titles read as sentences starting with `'should ...'`.

## Path Aliases (test-specific)

| Alias    | Use for                                        |
| -------- | ---------------------------------------------- |
| `$test`  | Test beds and helpers (`$test/beds/query/...`) |
| `$mocks` | Mock response & mapped fixtures, MSW handlers  |

Never import from `test/` or `src/mocks/` via relative paths.
