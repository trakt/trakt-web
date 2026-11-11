---
trigger: glob
globs: '**'
description: 'Core project overview: stack, where code goes, rules every task needs, aliases, commits and tooling. Apply to all files.'
applyTo: '**'
---

# Project Guidelines

SvelteKit + TypeScript app (Svelte 5, runes mode) deployed to Cloudflare
Workers. Bun workspaces monorepo; the app lives in `projects/client/`.

## Where code goes (`projects/client/src/`)

- `routes/` - file-based routing. Pages are thin shells that compose features
  and sections; layouts wrap children with providers (e.g. `CalendarProvider`).
- `lib/features/` - self-contained domains that own their state, components and
  queries. Expose a public API; keep internals in `_internal/`.
- `lib/components/` - reusable UI. `lib/sections/` - page composition (navbar,
  lists, profile, layout shells).
- `lib/guards/` - `RenderFor` / `RenderForFeature`; use them instead of inline
  `{#if}` for auth, feature and audience gating.
- `lib/requests/` - API queries (`defineQuery()`) and pure mappers; Zod
  validates at the boundary.
- `lib/stores/` - RxJS `BehaviorSubject` state, often persisted to
  `localStorage`. Prefer `$derived()` over another store for computed values.
- `lib/models/` types, `lib/utils/` utilities by domain, `lib/pages/`
  page-specific logic and error pages, `lib/pwa/` manifest + service worker.
- `lib/paraglide/` - generated i18n, never edit. Messages are type-safe
  functions (`m.page_title_home()`); sources live in `i18n/meta/`.
- `style/` global SCSS and tokens; `mocks/` MSW handlers and data.

## Always

- Import through aliases, never `../../../`: `$lib` (src/lib), `$style`
  (src/style), `$mocks` (src/mocks), `$test` (test), `$worker` (src/worker),
  `$e2e` (e2e).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`.
- `bun run client:dev` starts the dev server. ESLint config: `eslint.config.js`.
  The build (Vite + adapter-cloudflare) generates i18n first. Formatting rules
  live in `implementation.md`.

## More rules, loaded when the task needs them

- `styling.md` - SCSS, tokens, theming, responsive mixins, RTL-safe layout.
- `components.md` - UI surface, incl. `data-*` variants, snippets, guards, RTL.
- `requests.md`, `utils.md`, `performance.md`, `analytics.md` - CLAUDE.md says
  when to read each.
