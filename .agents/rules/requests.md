---
trigger: glob
globs: 'projects/client/src/lib/requests/**'
description: 'How to implement API queries and mutation requests in lib/requests.'
applyTo: 'projects/client/src/lib/requests/**'
---

# API Requests Guidelines

## Overview

`lib/requests/` integrates with two sources:

- **`@trakt/api`** — Typed SDK for the Trakt v2 REST API. Use `api({ fetch })`
  to call it.
- **`v3/` endpoints** — Untyped internal endpoints accessed via `rawApiFetch`.
  Always define a local Zod schema for their response.

---

## Naming Conventions

| File type       | Convention                  | Example                                      |
| --------------- | --------------------------- | -------------------------------------------- |
| Query file      | `{name}Query.ts`            | `movieSummaryQuery.ts`                       |
| Mutation file   | `{name}Request.ts`          | `addToWatchlistRequest.ts`                   |
| Mapper function | `mapTo{Entity}.ts`          | `mapToMovieEntry.ts`                         |
| Model / schema  | `{EntityName}.ts`           | `MediaEntry.ts`                              |
| Export name     | camelCase matching filename | `movieSummaryQuery`, `addToWatchlistRequest` |

---

## Pattern 1 — `@trakt/api` Query (`defineQuery`)

Use this for standard single-fetch queries backed by the typed SDK.

```ts
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { SomeSchema } from '$lib/requests/models/SomeModel.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SomeApiResponse } from '@trakt/api'; // only if you need the raw type in the mapper

type SomeParams = {
  slug: string;
} & ApiParams;

const someRequest = (
  { fetch, slug }: SomeParams,
) =>
  api({ fetch })
    .category
    .method({
      params: { id: slug },
      query: { extended: 'full,images' },
    });

export const someQuery = defineQuery({
  key: 'someKey',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: someRequest,
  mapper: (response) => mapToSomething(response.body),
  schema: SomeSchema,
  ttl: time.hours(3),
});
```

### Key rules

- The `request` function receives the full `params` object — destructure only
  what you need.
- `mapper` transforms `response.body` (typed by the SDK) into the domain model.
- `schema` is the Zod schema for the **output** — it validates what `mapper`
  returns.
- `dependencies` must list every param that, when changed, should refetch. Use
  spread helpers for filters/search (see below).
- `invalidations` lists `InvalidateAction.*` tokens that bust this cache when
  mutations fire.

---

## Pattern 2 — `@trakt/api` Paginated Query (`defineInfiniteQuery`)

Use this for list endpoints that support pagination.

```ts
import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';

type SomeListParams =
  & { slug: string }
  & PaginationParams
  & ApiParams;

const someListRequest = (
  { fetch, slug, limit, page }: SomeListParams,
) =>
  api({ fetch })
    .category
    .list({
      params: { id: slug },
      query: { extended: 'full,images', page, limit },
    });

export const someListQuery = defineInfiniteQuery({
  key: 'someList',
  invalidations: [],
  dependencies: (params) => [params.slug, params.page, params.limit],
  request: someListRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(EntrySchema),
  ttl: time.hours(1),
});
```

### Key rules

- Always use `PaginatableSchemaFactory(EntrySchema)` for the schema.
- Always call `extractPageMeta(response.headers)` to populate the `page` field.
- Include `params.page` and `params.limit` in `dependencies`.

---

## Pattern 3 — `v3/` Endpoint Query

`v3/` endpoints are not covered by `@trakt/api`'s type system. **Always** define
a Zod schema locally for their response, and parse with it before returning from
the request function.

```ts
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';

// 1. Define the raw response schema inline (v3 responses have no SDK types)
export const SomeV3ResponseSchema = z.object({
  field_name: z.string(),
  nested: z.object({
    value: z.number(),
  }),
});

type SomeV3Response = z.infer<typeof SomeV3ResponseSchema>;

type SomeParams = { slug: string } & ApiParams;

// 2. Use rawApiFetch and parse the response body with the schema
const someRequest = async (
  { fetch, slug }: SomeParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/some/endpoint/${slug}` },
  );

  return response.ok
    ? {
      body: SomeV3ResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

// 3. Map from the raw response to the domain model
export const someV3Query = defineQuery({
  key: 'someV3',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: someRequest,
  mapper: (response) => mapToSomeDomainModel(response.body),
  schema: SomeDomainSchema,
  ttl: time.hours(3),
});
```

### Key rules

- **Always** `.parse()` the raw JSON — never trust unvalidated `v3/` responses.
- If the endpoint can return an empty/error body, guard with `response.ok` and
  return `{ body: undefined, status: 200 }` as the fallback so `mapper` receives
  `undefined` and can handle it gracefully.
- Export the `ResponseSchema` when other files need to reference it.
- Keep the raw response schema (`...ResponseSchema`) and domain schema
  (`...Schema`) separate.

---

## Pattern 4 — Mutation Request

Use for write operations (add, remove, update). These are plain async functions
— not queries.

```ts
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SomeApiRequestBody } from '@trakt/api';

type SomeActionParams = {
  body: SomeApiRequestBody;
} & ApiParams;

export function someActionRequest(
  { body, fetch }: SomeActionParams,
): Promise<boolean> {
  return api({ fetch })
    .category
    .action({ body })
    .then(({ status }) => status === 201); // or 200, 204 depending on the endpoint
}
```

For `v3/` mutations use `rawApiFetch` with `method: 'POST'` / `'DELETE'` and
validate with Zod if the response body matters.

---

## Mapper Functions

- Pure functions — no side effects, no API calls.
- Named `mapTo{DomainType}(apiResponse): DomainType`.
- Live in `_internal/` if reused across queries; inline or exported from the
  query file if used only once or twice.
- When extending an existing mapper (e.g., adding a field), prefer `.extend()`
  on the schema rather than duplicating.

```ts
// _internal/mapToEntry.ts
export function mapToEntry(response: EntryResponse): Entry {
  return {
    id: response.ids.trakt,
    key: `entry-${response.ids.trakt}`,
    title: response.title,
  };
}
```

---

## Models

- Define Zod schema first; derive the TypeScript type with `z.infer`.
- Use `.nullish()` for optional nullable fields, `.optional()` for fields that
  may be absent.
- Export both the schema (`EntitySchema`) and the type (`Entity`) from the same
  file.

```ts
// models/Entry.ts
import { z } from 'zod';

export const EntrySchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
  description: z.string().nullish(),
});

export type Entry = z.infer<typeof EntrySchema>;
```

---

## Invalidations

Use `InvalidateAction.*` to declare which mutations should bust a query's cache.

```ts
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';

invalidations: [
  InvalidateAction.Watchlisted('movie'),
  InvalidateAction.MarkAsWatched('episode'),
  InvalidateAction.List.Created,
],
```

Leave `invalidations: []` for queries that never need external cache busting.

---

## TTL Reference

`Infinity` should never be used used for TTL.

| Data freshness                    | Value                                    |
| --------------------------------- | ---------------------------------------- |
| Very stable (people, studios)     | `time.days(7)`                           |
| Stable (summaries, translations)  | `time.days(1)`                           |
| Normal (lists, ratings)           | `time.hours(3)` or `time.hours(6)`       |
| Frequently changing               | `time.minutes(30)` or `time.minutes(15)` |
| Real-time (watchers, now playing) | `time.minutes(5)` or lower               |

---

## Filter & Search Dependencies

When a query accepts `FilterParams` or `SearchParams`, spread the helper
functions in `dependencies`:

```ts
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';

dependencies: (params) => [
  params.limit,
  params.page,
  ...getGlobalFilterDependencies(params.filterOverride?.movie ?? params.filter),
  ...getRecordDependencies(params.search),
],
```

---

## Conditional Queries

Use `enabled` to skip fetching when required params are absent:

```ts
export const someQuery = defineQuery({
  // ...
  enabled: (params) => Boolean(params.slug),
});
```

---

## Authenticated vs Unauthenticated

| Client                         | When to use                                          |
| ------------------------------ | ---------------------------------------------------- |
| `api({ fetch })`               | Default — attaches Bearer token if user is signed in |
| `unauthorizedApi({ fetch })`   | Public endpoints that must not send auth headers     |
| `rawApiFetch({ fetch, path })` | `v3/` and other non-SDK endpoints — authenticated    |

---

## Quick Checklist

Before submitting a new query or request, verify:

- [ ] File is in the correct subfolder (`queries/{domain}/`, `sync/`, `vip/`)
- [ ] File name matches the exported symbol (`movieSummaryQuery.ts` →
      `movieSummaryQuery`)
- [ ] Params type intersects `ApiParams`
- [ ] `@trakt/api` endpoint: SDK chain via `api({ fetch })`
- [ ] `v3/` endpoint: `rawApiFetch` + local `ResponseSchema.parse()`
- [ ] `schema` matches the **output** of `mapper`, not the raw API response
- [ ] `dependencies` lists every param that should trigger a refetch
- [ ] `invalidations` lists relevant `InvalidateAction.*` tokens
- [ ] Mapper is a pure function — no side effects
- [ ] `ttl` is appropriate for the data's freshness requirements
