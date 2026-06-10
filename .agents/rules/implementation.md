---
trigger: glob
globs: '**'
description: 'General implementation approach for all source code in this project.'
applyTo: '**'
---

# Implementation Guidelines

## Before Writing Code

- **Search for existing patterns first.** This codebase has conventions - follow
  them.
- Check how similar functionality is implemented elsewhere before creating
  something new.
- Prefer referencing real files as examples over abstract descriptions.

## When Establishing New Patterns

- When you establish a new pattern that diverges from or extends existing
  conventions, note it so documentation can be updated.
- If you find yourself writing a helper used in 2+ places, consider whether it
  belongs in `lib/utils/`.
- If you refactor shared logic, document the new pattern.

## Naming Conventions

- **PascalCase**: component names, interfaces, type aliases
- **camelCase**: variables, functions, methods
- **ALL_CAPS**: global constants only (not local constants)
- Components: PascalCase files (e.g., `ClampedText.svelte`, `MoreButton.svelte`)
- Utilities/helpers: camelCase files (e.g., `lineClamp.ts`, `clickOutside.ts`)
- Type definitions: PascalCase files (e.g., `MediaStoreProps.ts`,
  `FilterParams.ts`)

## TypeScript Standards

- Always use TypeScript with strict mode.
- No `any` types; use specific types or utility types.
- Use Zod for runtime validation and type inference. Define schema first, then
  derive type with `z.infer`.
- Use `Nil` type for `null | undefined`.
- Use `.nullish()` in Zod schemas for optional nullable fields.
- Use optional chaining (`?.`) and nullish coalescing (`??`).

## URL & State Management

- Use URL search parameters to represent UI state (e.g., active tabs, filters,
  drawers) to make those states shareable via links.
- When updating URL search parameters for state changes, avoid polluting
  navigation history by replacing the current state instead of pushing a new one
  (e.g., use `replaceState: true` in SvelteKit's `goto` or the `replacestate`
  property).

## Fetching all pages automatically

When a caller needs ALL pages (not user-triggered pagination), use
`useAllPagesInfiniteQuery` instead of `useInfiniteQuery`. It automatically calls
`fetchNextPage()` after each page lands until `hasNextPage` is false, with a
live QueryClient guard to prevent duplicate fetches across multiple observers.

```ts
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';

const query = useAllPagesInfiniteQuery(
  someListQuery({ slug, limit: 1000 }),
);

// query emits InfiniteQueryObserverResult — access all entries via:
const entries = query.pipe(
  map((q) => q.data?.pages.flatMap((p) => p.entries) ?? []),
);
```

Use `useInfiniteQuery` only when pages are loaded on demand (e.g. "load more"
button or scroll-based pagination). Never put manual `tap + fetchNextPage` logic
on a query — use `useAllPagesInfiniteQuery` instead.

## Tooling (CRITICAL)

- **Formatting**: NEVER run `prettier`. ALWAYS run `deno fmt`.
- **Rule frontmatter quoting**: YAML frontmatter properties (`globs`, `applyTo`,
  `description`, `paths`) MUST use **single quotes** (`'`), never double quotes
  (`"`). Accepted by Copilot, Antigravity (Gemini), Claude. Never change `'` to
  `"` in any rule file header.
- **Copilot compatibility**: Always keep `applyTo` property in rule frontmatter.
