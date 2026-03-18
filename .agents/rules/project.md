---
trigger: glob
globs: "**"
description: "Core project overview, structure, architecture patterns, styling conventions, and tooling. Apply to all files."
applyTo: "**"
---

# Project Guidelines

## Tech Stack

SvelteKit + TypeScript app (Svelte 5, runes mode) deployed to Cloudflare Pages. Monorepo using Deno workspaces with the app at `projects/client/`.

## Project Structure

```
projects/client/src/
  routes/          # SvelteKit file-based routing
  lib/
    components/    # Reusable UI components (buttons, forms, dialogs, media, etc.)
    features/      # Feature modules — self-contained domains (auth, calendar, theme, i18n, etc.)
    sections/      # Page composition — navbar, lists, profile, layout shells
    guards/        # Conditional rendering (RenderFor, RenderForFeature, RenderForAudience)
    requests/      # API request mappers and query definitions
    stores/        # Reactive state (RxJS BehaviorSubject + localStorage)
    models/        # TypeScript type definitions
    utils/         # Utility functions organized by domain (actions/, array/, date/, string/, etc.)
    pages/         # Page-specific logic and error pages
    paraglide/     # Generated i18n messages (do not edit — auto-generated)
    pwa/           # PWA manifest and service worker config
  style/           # Global SCSS — design tokens, theme, animations
  mocks/           # MSW request mocking (handlers + test data)
```

## Commit Standards

- **Follow Conventional Commits**: All commits must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - Use types: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, etc.
  - Example: `feat: add user profile component`
  - Example: `fix: correct date formatting in calendar view`

## Architecture Patterns

### Pages are thin shells
Route pages compose features and sections. Business logic lives in `lib/features/`, not in route files. Layouts wrap children with providers (e.g., `CalendarProvider`).

### Features are self-contained
Each feature directory in `lib/features/` owns its state, components, and queries. Features expose a public API and keep internals in `_internal/` subdirectories.

### Components use data attributes for variants
Components use `data-variant`, `data-style`, `data-color` attributes for styling variants rather than prop-driven class concatenation.

### Snippets for flexible content
Use Svelte 5 `{#snippet}` for reusable template fragments and component slot alternatives.

### Guards for conditional rendering
Use `RenderFor`, `RenderForFeature`, `RenderForAudience` components instead of inline `{#if}` blocks for auth/feature/audience gating.

### Stores use RxJS + localStorage
State management uses `BehaviorSubject` from RxJS, often backed by `localStorage` for persistence. Prefer `$derived()` for computed values over additional stores.

### API requests use mappers
`lib/requests/` contains query definitions via `defineQuery()` and pure mapper functions that transform API responses to domain models. Zod validates at the boundary.

### i18n via Paraglide
Internationalization uses Paraglide JS (Inlang). Messages are type-safe functions: `m.page_title_home()`. Source definitions live in `i18n/meta/`, generated output in `lib/paraglide/`. Never edit generated files.

## Styling

- SCSS with scoped Svelte `<style lang="scss">` blocks.
- All values via CSS custom properties (`--ni-*`, `--color-*`, `--gap-*`, `--border-radius-*`).
- Responsive mixins: `for-mobile`, `for-tablet-sm`, `for-desktop`, `for-mouse`, `for-touch`.
- Import mixins as: `@use "$style/scss/mixins/index" as *;`
- Full light/dark theme support. Never use raw hex values — use semantic CSS variables.
- Use kebab-case for CSS class names.
- Component-scoped styles preferred.

## Tooling

- **Formatter**: Use `deno fmt`, not prettier.
- **Linter**: ESLint with TypeScript + Svelte plugins. Config at `eslint.config.js`.
- **Build**: Vite + SvelteKit adapter-cloudflare. Paraglide generates i18n before build.
- **Dev**: `deno task client:dev` starts the dev server.
