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

Purely presentational, reusable across app. No awareness of API shapes or app
state.

### `lib/features/`

Each subdirectory is self-contained feature. Features own their state,
providers, contexts, and domain-specific sub-components.

### `lib/sections/`

Page-level composition components. Sections know domain data shapes and compose
features + `lib/components` into page regions.

### `lib/guards/`

Thin conditional-rendering wrappers - use instead of inline `{#if}` for auth /
feature / audience / device gating.

---

## The `_internal/` Rule

`_internal/` folders enforce file-private visibility. Strict rule:

> **File inside `folderA/_internal/` may only be imported by files inside
> `folderA/` or `folderA/_internal/` itself.**

If a helper, sub-component, or context factory is needed outside its parent
folder, it must be **uplifted** - moved to `folderA/` (and exported) or to a
higher-level shared location.

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

All components use Svelte 5 runes mode. Never use `export let`, `$:`, or
`createEventDispatcher`.

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

For components with 3+ props, define separate `ComponentNameProps.ts` file
(usually inside component folder or `_internal/`).

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

Use `Snippet` (from `svelte`) for slot-like composition - never the legacy slot
API.

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

Matching `getXxxContext()` function called by child components to access shared
state:

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

Feature state often exposed via `use*` composable functions returning reactive
RxJS-based state.

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
- Do **not** import across feature boundaries - if sharing needed, expose via
  context or shared section

### Hooks that drive `useQuery` take `Observable<T>`, never a bare value

When the hook internally calls `useQuery`, accept the reactive input as
`Observable<T>` and pipe it into the query options:

```typescript
// routes/shows/[slug]/useShow.ts
export function useShow(slug$: Observable<string>) {
  const show = useQuery(slug$.pipe(map((slug) => showSummaryQuery({ slug }))));
  // ...
}
```

Consumers lift the rune into an Observable with `fromRune`:

```svelte
<!-- routes/shows/[slug]/+page.svelte -->
<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useShow } from "./useShow";

  const { params }: PageProps = $props();
  const slug$ = fromRune(() => params.slug);
  const { show, intl } = useShow(slug$);
</script>
```

**Never** wrap a query-driving hook in `$derived`:

```svelte
<!-- WRONG - re-instantiates the entire QueryObserver chain on every
     reactive tick, spawning N observers per page visit -->
const { show } = $derived(useShow(params.slug));
```

Specs and one-shot static input lift the value with `valueObservable(value)`
from `$test/beds/store/valueObservable.ts` (NOT `of(value)`, which completes
synchronously and closes the outer subscriber before fetch emits).

Hooks that do NOT call `useQuery` (e.g. `useIsMe`, `useDangerButton`,
`useToggler`) can keep bare-value signatures; their `$derived` re-runs are cheap
glue, not QueryObserver churn. See `performance.md` "Driving hooks from Svelte
runes" for the full perf rationale.

---

## URL Navigation in Feature Hooks

Never mutate `page.url.searchParams` (or any other property of `page` from
`$app/state`) directly. `page` is Svelte reactive state: in-place mutations
trigger a reactive flush, and if a query observer fires during that flush it
will attempt to set `$state` inside a `$derived` context →
`state_unsafe_mutation`.

Always build a URL copy and pass it to `goto`:

```typescript
// Good
const url = new URL(page.url);
url.searchParams.set('key', 'value');
goto(url, { replaceState: true });

// Bad — mutates reactive state, may cause state_unsafe_mutation
page.url.searchParams.set('key', 'value');
goto(page.url, { replaceState: true });
```

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

Use global typography utility classes from `style/typography/index.css` for font
styling. Do **not** write custom font-size or font-weight declarations when a
utility class covers it.

```svelte
<!-- Good -->
<span class="bold ellipsis">Movie title</span>
<span class="tag secondary">2024</span>

<!-- Bad - manual override when a class exists -->
<span style="font-weight: 600">Movie title</span>
```

When manual `font-size` override is unavoidable (e.g. responsive tweaks), prefer
semantic font-size variables over raw sizing tokens:

```scss
// Good
font-size: var(--font-size-tag); // semantic intent is clear

// Bad
font-size: var(--ni-10); // raw value, no semantic meaning
```

---

## `data-*` Attributes for Variants

Components use `data-*` attributes for styling variants instead of class
concatenation.

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
| `data-color`   | Color token (purple, red, neutral, …)  |
| `data-size`    | Size token (small, normal, large, …)   |
| `data-state`   | Discrete state (open, closed, loading) |

---

## CSS Class Naming Convention

The codebase follows a strict, **non-BEM, namespaced kebab-case** convention.
Stick to it. New components that diverge create reviewer noise and visual
regressions when global selectors collide. Class names must be semantic and
role-based: describe purpose/content, not position, raw styling, or DOM shape.

### 1. Root class: `trakt-{component-name-kebab}`

Every component's outermost element carries a single namespaced root class
derived from the file name. The prefix `trakt-` scopes the component within the
global CSS surface and prevents collisions with utility classes.

```svelte
<!-- AutoCloseButton.svelte -->
<button class="trakt-auto-close-button"> … </button>

<!-- TopNavbar.svelte -->
<nav class="trakt-navbar"> … </nav>

<!-- SummaryHeader.svelte -->
<header class="trakt-summary-header"> … </header>
```

- One root class per component. Do not stack `class="trakt-x trakt-y"` at the
  root; if two namespaces apply, the component is doing two jobs.
- Match the component file name in kebab-case. Short semantic aliases are
  acceptable when the file name is long and the alias is unambiguous
  (`TopNavbar` → `.trakt-navbar`, `Card` → `.trakt-card`), but **never drop the
  `trakt-` prefix**.
- Icon components and pure utility wrappers without their own styles are
  exempt - they do not need a root class at all.

### 2. Nested element classes: scoped kebab-case, no prefix

Child elements inside a `trakt-*` root use plain kebab-case names. The SCSS
nests them under the root selector so the global namespace stays clean.

```svelte
<div class="trakt-card">
  <div class="card-cover"> … </div>
  <span class="card-title"> … </span>
</div>
```

```scss
.trakt-card {
  .card-cover { … }
  .card-title { … }
}
```

- Child class names are kebab-case.
- Do **not** use BEM `__` or `--` separators (`card__cover`, `card--large`). The
  codebase does not use BEM.
- Do **not** prefix children with `trakt-` again. The root scope is enough.

### 3. State modifiers: `is-*` / `has-*`, toggled via `class:`

Binary states (active, disabled, loading, expanded, dragging, error) are
expressed as state classes prefixed `is-` or `has-`, toggled with Svelte's
`class:` binding.

```svelte
<div
  class="trakt-drawer"
  class:is-open={open}
  class:is-loading={loading}
  class:has-error={error}
> … </div>
```

```scss
.trakt-drawer {
  &.is-open { … }
  &.is-loading { … }
  &.has-error { … }
}
```

- `is-*` for the element's own state.
- `has-*` when state describes the presence of a child or property.
- Reserve `class:` for these state toggles and for typography utility opt-ins
  (`class:bold`, `class:ellipsis`). Never use it to switch between visual
  variants - those are `data-variant` attributes.

### 4. Variants: `data-*` attributes, not class concatenation

See the `data-*` section above. Variants, sizes, colors, layouts, and tiers are
driven by `data-*` attributes bound directly from props. Never build a class
string like `class="btn btn-{variant} btn-{size}"`.

### 5. Style selectors: chained, not generic

SCSS selectors always anchor to the component's `trakt-*` root or a child class.
Element-only selectors (`button { … }`, `div > span { … }`) leak across
components and are forbidden.

```scss
// Good
.trakt-button { … }
.trakt-button[data-variant='primary'] { … }
.trakt-button .button-label { … }

// Bad
button { … }                    // leaks globally
.primary { … }                  // collides with utility
.button[data-variant='primary'] // unprefixed, fragile
```

### 6. Inline `style` only for CSS variables and layout tricks

Inline `style=` is restricted to:

- CSS custom property injection: `style="--tab-count: {n}"`
- Layout primitives that have no class equivalent: `style="display: contents"`
- Stacking context references: `style="z-index: var(--layer-top)"`

Never inline raw property values (`style="color: #fff"`,
`style="margin-top: 12px"`) - define a class or use a token.

### 7. Forbidden patterns

| Pattern                              | Use instead                              |
| ------------------------------------ | ---------------------------------------- |
| `class="movieCard"` (camelCase)      | `class="trakt-movie-card"`               |
| `class="MovieCard"` (PascalCase)     | `class="trakt-movie-card"`               |
| `class="card card--large card__cta"` | root + child kebab + `data-size="large"` |
| `class="flex items-center mt-4"`     | scoped SCSS rules; no utility chains     |
| `class:variantPrimary={…}`           | `data-variant="primary"`                 |
| Root class without `trakt-` prefix   | Add the prefix                           |
| Generic element selectors in SCSS    | Anchor to `.trakt-*` root                |

### 8. When the root class deviates

If a new component cannot follow rule 1 (e.g. it wraps a third-party widget that
already namespaces itself, like `tsqd-parent-container` for React Query
Devtools), call it out in the PR description. Default is the prefix.

---

## Lazy Rendering on Cards

Cards rendering below the fold should defer rendering until visible.
`whenInViewport` action takes a plain callback (no object param):

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

Always import Paraglide messages namespace as `m` and call messages as
functions. Never inline literal user-facing strings.

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

If a drawer component calls `use*` hooks to load data itself, name it
`*DrawerHost`. If it receives all data via props, name it `*Drawer`.

---

## Displaying User Names

Always use `toDisplayableName` from `$lib/utils/profile/toDisplayableName.ts`
when rendering a user's name. It returns the full name when available, or falls
back to `@username`.

```svelte
<script lang="ts">
  import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';
</script>

<!-- Good -->
<span>{toDisplayableName(profile)}</span>

<!-- Bad - bypass the utility and re-implement the fallback logic inline -->
<span>{profile.name.full || `@${profile.username}`}</span>
```

When passing a name into an i18n message, pass the result of `toDisplayableName`
as the variable, never construct the `@`-prefixed string inside the message key
itself, as `@` in message strings breaks the generated JSDoc output.

```svelte
<!-- Good -->
{m.some_message({ username: toDisplayableName(profile) })}

<!-- Bad - @ inside the message default value causes a JSDoc parse error -->
{m.some_message({ username: profile.username })}
```

---

## i18n and HTML in Translations

Never render translation messages via `{@html}`. If a message embeds markup, use
the appropriate helper component instead:

- **`MessageWithBold`** (`$lib/components/text/MessageWithBold.svelte`) —
  renders `<b>…</b>` segments in a message as real `<b>` elements.
- **`MessageWithLink`** (`$lib/components/link/MessageWithLink.svelte`) —
  renders an `<a>…</a>` segment as a real link.

```svelte
<!-- Bad -->
<p>{@html m.some_message({ value })}</p>

<!-- Good -->
<p><MessageWithBold message={m.some_message({ value })} /></p>
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
- [ ] Root class is `trakt-{component-name-kebab}` (single class, namespaced)
- [ ] Child element classes are scoped kebab-case under the root - no `trakt-`
      prefix on children, no BEM `__`/`--` separators
- [ ] State toggles use `class:is-*` / `class:has-*` - never camelCase or
      variant-style class toggles
- [ ] No element-only or generic CSS selectors (`button { … }`,
      `.primary { … }`) - always anchored to the `trakt-*` root
- [ ] No inline `style=` for raw property values - only CSS variables, layout
      tricks (`display: contents`), or `z-index` token refs
- [ ] SCSS uses CSS custom properties (`--ni-*`, `--color-*`) - no raw hex
      values
- [ ] Font styling uses typography utility classes (`.bold`, `.ellipsis`,
      `.tag`, etc.) - no manual `font-weight`/`font-size` when a class covers it
- [ ] When `font-size` overrides are needed, uses semantic variables
      (`--font-size-tag`, `--font-size-text`) not raw tokens (`--ni-10`)
