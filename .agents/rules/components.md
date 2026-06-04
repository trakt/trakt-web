---
trigger: glob
globs: 'projects/client/src/lib/{components,features,sections,guards}/**'
description: 'Architecture, patterns, and conventions for lib/components, lib/features, lib/sections, and lib/guards.'
applyTo: 'projects/client/src/lib/{components,features,sections,guards}/**'
---

# Components, Features & Sections Guidelines

## Overview

UI code split across four directories, each with distinct role:

| Directory        | Role                                                          |
| ---------------- | ------------------------------------------------------------- |
| `lib/components` | Generic, reusable UI primitives - zero domain knowledge       |
| `lib/features`   | Stateful feature modules: providers, contexts, store hooks    |
| `lib/sections`   | Page-level composition - orchestrates features + components   |
| `lib/guards`     | Conditional rendering gates (`RenderFor`, `RenderForFeature`) |

---

## Directory Structure

### `lib/components/`

Purely presentational, reusable across app. No awareness of API shapes or app state.

### `lib/features/`

Each subdirectory is self-contained feature. Features own their state, providers, contexts, and domain-specific sub-components.

### `lib/sections/`

Page-level composition components. Sections know domain data shapes and compose features + `lib/components` into page regions.

### `lib/guards/`

Thin conditional-rendering wrappers - use instead of inline `{#if}` for auth / feature / audience / device gating.

---

## The `_internal/` Rule

`_internal/` folders enforce file-private visibility. Strict rule:

> **File inside `folderA/_internal/` may only be imported by files inside
> `folderA/` or `folderA/_internal/` itself.**

If a helper, sub-component, or context factory is needed outside its parent folder, it must be **uplifted** - moved to `folderA/` (and exported) or to a higher-level shared location.

**Never import from another folder's `_internal/`.**

```
features/
  search/
    _internal/
      createSearchContext.ts  ← only used inside search/
    SearchProvider.svelte     ← imports _internal/createSearchContext ✔
    index.ts                  ← re-exports public API

sections/
  summary/
    components/
      _internal/
        SummaryTitleMapper.ts ← only used inside summary/components/
      SummaryTitle.svelte     ← imports _internal/SummaryTitleMapper ✔

# WRONG - do not do this:
features/upsell/UpsellCta.svelte  ← importing search/_internal/createSearchContext ✗
```

---

## Svelte 5 Runes

All components use Svelte 5 runes mode. Never use `export let`, `$:`, or `createEventDispatcher`.

```svelte
<script lang="ts">
  import type { ButtonProps } from './_internal/ButtonProps.ts';

  const { variant = 'primary', onclick, children }: ButtonProps = $props();

  const isDisabled = $derived(variant === 'ghost' && !onclick);
</script>
```

Key runes:

| Rune            | Use                                                                                    |
| --------------- | -------------------------------------------------------------------------------------- |
| `$props()`      | Declare component props (replaces `export let`)                                        |
| `$derived`      | Computed value (cached, replaces `$:`)                                                 |
| `$derived.by()` | Computed value with multi-line logic                                                   |
| `$effect`       | Side effect that re-runs on dependency change (do not use unless absolutely necessary) |
| `$effect.pre`   | Side effect that runs before DOM updates (do not use unless absolutely necessary)      |

---

## Props Type Files

For components with 3+ props, define separate `ComponentNameProps.ts` file (usually inside component folder or `_internal/`).

```typescript
// buttons/_internal/TraktButtonProps.ts
import type { Snippet } from 'svelte';

export type TraktButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: Snippet;
  children: Snippet;
  onclick?: () => void;
};
```

Use `Snippet` (from `svelte`) for slot-like composition - never the legacy slot API.

---

## Snippets for Composition

Use `{#snippet}` and `Snippet` type for flexible content injection.

```svelte
<!-- In the component -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  const { children, footer }: { children: Snippet; footer?: Snippet } = $props();
</script>

<div class="modal">
  {@render children()}
  {#if footer}
    <footer>{@render footer()}</footer>
  {/if}
</div>
```

```svelte
<!-- At the call site -->
<Modal>
  <p>Content here</p>
  {#snippet footer()}<button>Close</button>{/snippet}
</Modal>
```

---

## Provider Pattern

Feature providers are thin shells calling a context factory from `_internal/`.

```svelte
<!-- features/search/SearchProvider.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { iffy } from '$lib/utils/function/iffy.ts';
  import { createSearchContext } from './_internal/createSearchContext.ts';

  const { children }: { children: Snippet } = $props();

  iffy(createSearchContext);
</script>

{@render children()}
```

Matching `getXxxContext()` function called by child components to access shared state:

```typescript
// features/search/_internal/getSearchContext.ts
import { getContext } from 'svelte';
import type { SearchContext } from './SearchContext.ts';

export function getSearchContext(): SearchContext {
  return getContext<SearchContext>('search');
}
```

Naming conventions:

| File                            | Purpose                                    |
| ------------------------------- | ------------------------------------------ |
| `XxxProvider.svelte`            | Provider shell component                   |
| `_internal/createXxxContext.ts` | Calls `setContext`, returns context object |
| `_internal/getXxxContext.ts`    | Wraps `getContext` with proper typing      |
| `_internal/XxxContext.ts`       | TypeScript type for context object         |

---

## `use*` Hooks (Feature Stores)

Feature state often exposed via `use*` composable functions returning reactive RxJS-based state.

```typescript
// features/auth/stores/useUser.ts
export function useUser() {
  const query = useQuery(userQuery({ fetch }));

  return {
    user: $derived(query.data),
    isLoading: $derived(query.isLoading),
  };
}
```

- Live in `features/{domain}/stores/` (or `features/{domain}/stores/_internal/`)
- Name always starts with `use` (e.g., `useUser`, `useTheme`, `useFilters`)
- Return `$derived` values, not raw observables
- Do **not** import across feature boundaries - if sharing needed, expose via context or shared section

---

## Guard Components

Use guards instead of inline `{#if auth.isLoggedIn}` or `{#if isDesktop}`:

```svelte
<RenderFor audience="member">
  <WatchlistButton />
</RenderFor>

<RenderFor device="desktop">
  <DesktopSidebar />
</RenderFor>

<RenderForFeature flag="notes">
  <NotesPanel />
</RenderForFeature>
```

`RenderFor` props: `audience`, `device`, `input` (combinable).

---

## Font Styling

Use global typography utility classes from `style/typography/index.css` for font styling. Do **not** write custom font-size or font-weight declarations when a utility class covers it.

```svelte
<!-- Good -->
<span class="bold ellipsis">Movie title</span>
<span class="tag secondary">2024</span>

<!-- Bad - manual override when a class exists -->
<span style="font-weight: 600">Movie title</span>
```

When manual `font-size` override is unavoidable (e.g. responsive tweaks), prefer semantic font-size variables over raw sizing tokens:

```scss
// Good
font-size: var(--font-size-tag); // semantic intent is clear

// Bad
font-size: var(--ni-10); // raw value, no semantic meaning
```

---

## `data-*` Attributes for Variants

Components use `data-*` attributes for styling variants instead of class concatenation.

```svelte
<button data-variant="primary" data-style="filled">
  {@render children()}
</button>
```

```scss
button[data-variant='primary'] { … }
button[data-style='filled'] { … }
```

Common attributes:

| Attribute      | Purpose                                |
| -------------- | -------------------------------------- |
| `data-variant` | Visual variant (primary, secondary, …) |
| `data-style`   | Style modifier (filled, outlined, …)   |

---

## Lazy Rendering on Cards

Cards rendering below the fold should defer rendering until visible. `whenInViewport` action takes a plain callback (no object param):

```svelte
<script lang="ts">
  import { whenInViewport } from '$lib/utils/actions/whenInViewport.ts';
  let isVisible = $state(false);
</script>

<div use:whenInViewport={() => (isVisible = true)}>
  {#if isVisible}
    <CardContent />
  {/if}
</div>
```

---

## i18n in Components

Always import Paraglide messages namespace as `m` and call messages as functions. Never inline literal user-facing strings.

```svelte
<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
</script>

<button aria-label={m.button_label_retry()}>
  {m.button_text_retry()}
</button>
```

---

## Drawer Naming Convention

Drawers follow a split naming pattern:

| Suffix        | Role                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `*Drawer`     | Pure-content drawer (props in → `<Drawer>` out), router, or provider |
| `*DrawerHost` | Fetches its own data via `use*` hooks, then renders `<Drawer>`       |

If a drawer component calls `use*` hooks to load data itself, name it `*DrawerHost`. If it receives all data via props, name it `*Drawer`.

---

## Displaying User Names

Always use `toDisplayableName` from `$lib/utils/profile/toDisplayableName.ts` when rendering a user's name. It returns the full name when available, or falls back to `@username`.

```svelte
<script lang="ts">
  import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';
</script>

<!-- Good -->
<span>{toDisplayableName(profile)}</span>

<!-- Bad - bypass the utility and re-implement the fallback logic inline -->
<span>{profile.name.full || `@${profile.username}`}</span>
```

When passing a name into an i18n message, pass the result of `toDisplayableName` as the variable, never construct the `@`-prefixed string inside the message key itself, as `@` in message strings breaks the generated JSDoc output.

```svelte
<!-- Good -->
{m.some_message({ username: toDisplayableName(profile) })}

<!-- Bad - @ inside the message default value causes a JSDoc parse error -->
{m.some_message({ username: profile.username })}
```

---

## Where to Place a New Component

| Question                                              | Place in                                     |
| ----------------------------------------------------- | -------------------------------------------- |
| Is it a generic UI primitive with no app state?       | `lib/components/{domain}/`                   |
| Does it manage state or provide context?              | `lib/features/{feature}/`                    |
| Does it compose multiple features into a page region? | `lib/sections/{section}/`                    |
| Is it a private implementation detail of folder X?    | `lib/{...}/X/_internal/`                     |
| Is it used by 2+ sibling folders in `_internal/`?     | Uplift to parent folder or `lib/components/` |

---

## Quick Checklist

- [ ] Correct layer: primitive → `components`, stateful/context → `features`,
      composition → `sections`
- [ ] Never import from another folder's `_internal/` - uplift if needed
- [ ] Using Svelte 5 runes (`$props`, `$derived`, `$effect`) - no `export let`
      or `$:`
- [ ] Snippets used for slot-like composition, not legacy `<slot>`
- [ ] Props type file created for components with 3+ props
- [ ] Provider delegates to `_internal/createXxxContext` via `iffy()`
- [ ] `use*` hooks live in `features/{domain}/stores/` and return `$derived`
      values
- [ ] Guards (`RenderFor`, `RenderForFeature`) used instead of raw `{#if}` for
      auth/feature/device gating
- [ ] Variants expressed via `data-*` attributes, not dynamic class strings
- [ ] SCSS uses CSS custom properties (`--ni-*`, `--color-*`) - no raw hex
      values
- [ ] Font styling uses typography utility classes (`.bold`, `.ellipsis`,
      `.tag`, etc.) - no manual `font-weight`/`font-size` when a class covers it
- [ ] When `font-size` overrides are needed, uses semantic variables
      (`--font-size-tag`, `--font-size-text`) not raw tokens (`--ni-10`)
