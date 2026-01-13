# Code Review Style Guide

This style guide outlines coding standards and best practices for the Trakt Web
project (SvelteKit + TypeScript with Svelte 5 in runes mode).

## General Principles

### Simplicity and Functionality

- **Keep it simple**: Suggestions should be simple and functional
- **Low visual complexity**: Avoid over-engineered solutions
- **Function decomposition**: Split suggestions into smaller functions when
  needed
- **Avoid over-engineering**: Solutions should not be unnecessarily complex

### Response Style

- Responses should be concise and to the point
- Focus on functional implementation rather than theoretical discussions

## Naming Conventions

### General Rules

- **PascalCase**: Component names, interfaces, and type aliases
  ```typescript
  type LineClampProps = { ... }
  interface MediaIntl extends EpisodeIntl { ... }
  ```

- **camelCase**: Variables, functions, and methods
  ```typescript
  const isClamped = writable(false);
  function findRegionalIntl(props: ToMediaOrEpisodeIntlProps) { ... }
  ```

- **ALL_CAPS**: Constants
  ```typescript
  const DEFAULT_SHARE_COVER = '...';
  const NOOP_FN = () => {};
  ```

### File Naming

- Components: PascalCase (e.g., `ClampedText.svelte`, `MoreButton.svelte`)
- Utilities/helpers: camelCase (e.g., `lineClamp.ts`, `clickOutside.ts`)
- Type definitions: PascalCase (e.g., `MediaStoreProps.ts`, `FilterParams.ts`)

## TypeScript Standards

### Type Safety

- **Always use TypeScript**: All `.ts` and `.svelte` files should be strongly
  typed
- **Strict mode enabled**: `"strict": true` in tsconfig.json
- **No `any` types**: Use specific types or appropriate utility types

### Type Definitions

#### Props Types

Define props types inline or as separate types:

```typescript
type LineClampProps = {
  label: string;
  classList?: string;
} & ChildrenProps;

const { children, label, classList = '' }: LineClampProps = $props();
```

#### Union Types

Use discriminated unions for complex type scenarios:

```typescript
export type MediaStoreProps<T extends { id: number } = { id: number }> =
  | EpisodeProps<T>
  | ShowProps<T>
  | MovieProps<T>;
```

#### Utility Types

Leverage TypeScript utility types:

```typescript
type FilterParams = DeepPartial<{
  filter: FilterParam;
  filterOverride?: FilterOverrideParams;
}>;
```

### Zod Schemas

- Use Zod for runtime validation and type inference
- Define schema first, then derive type:

```typescript
export const MediaIntlSchema = EpisodeIntlSchema.extend({
  tagline: z.string().nullish(),
});
export type MediaIntl = z.infer<typeof MediaIntlSchema>;
```

### Null Handling

- Use `Nil` type for `null | undefined`
- Use `.nullish()` in Zod schemas for optional nullable fields
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## Svelte 5 Runes Mode

### Reactive State with Runes

#### `$props()`

Define component props:

```typescript
const { children, label, classList = '' }: LineClampProps = $props();
```

#### `$derived()`

Create derived reactive values:

```typescript
const isExpanded = $derived($lines === 1337);
const hasValidRating = $derived(rating !== undefined);
const title = $derived(intl?.title ?? media?.title ?? '');
```

- Use for computed values that depend on reactive state
- Can destructure from functions/objects:

```typescript
const { isCollapsed, toggle } = $derived(useCollapsedList(id));
```

## Component Structure

### Script Block

```typescript
<script lang="ts">
  // 1. Imports (grouped logically)
  import Component from "$lib/components/Component.svelte";
  import { utility } from "$lib/utils/utility";
  
  // 2. Type definitions
  type ComponentProps = {
    prop: string;
  } & ChildrenProps;
  
  // 3. Props destructuring
  const { children, prop }: ComponentProps = $props();
  
  // 4. Reactive state (stores)
  const state = writable(initialValue);
  
  // 5. Derived values
  const derived = $derived($state > 0);
  const { value } = $derived(useHook());
  
  // 6. Functions
  function handleClick() { ... }
</script>
```

### Template

```svelte
<!-- Use proper hierarchy and semantic HTML -->
<div class="container">
  <p use:action={params} use:anotherAction class="content">
    {@render children()}
  </p>
  
  {#if condition}
    <Component />
  {/if}
</div>
```

### Snippets

Use snippets for reusable template fragments:

```svelte
{#snippet navbarState(hasFilters: boolean)}
  <NavbarStateSetter {hasFilters}>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>
{/snippet}

{@render navbarState(true)}
```

### Style Block

```svelte
<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .container {
    display: flex;
    gap: var(--gap-xs);
    
    @include for-tablet-sm-and-below {
      flex-direction: column;
    }
  }
</style>
```

### Custom Hooks Pattern

Create composable functions that return reactive state:

```typescript
function useFeatureFlag(flag: FeatureFlag) {
  const isEnabled = writable(false);
  // ... logic
  return { isEnabled };
}

// Usage in component
const { isEnabled } = $derived(useFeatureFlag(flag));
```

## Styling

### SCSS with Mixins

```scss
@use '$style/scss/mixins/index' as *;

.component {
  display: flex;
  gap: var(--gap-xs);

  @include for-tablet-sm-and-below {
    flex-direction: column;
  }
}
```

### CSS Variables

Use CSS custom properties for theming:

```scss
.element {
  color: var(--color-link-active);
  padding: var(--gap-xs);
  font-size: var(--font-size-text);
  transition: calc(var(--transition-increment) * 2) ease-in-out;
}
```

### Class Naming

- Use kebab-case for CSS classes
- Descriptive, semantic names
- Component-scoped styles preferred

### Dynamic Classes

```svelte
<div class="item" class:active={isActive}>
```

### Actions for Dynamic Styling

```svelte
<p use:appendClassList={classList} class="base-class">
```

## Actions and Utilities

### Svelte Actions

Actions follow a consistent pattern:

```typescript
export function actionName(node: HTMLElement, params?: ActionParams) {
  // Setup logic

  function handler(event: Event) {
    // Handle event
  }

  node.addEventListener('event', handler);

  return {
    update(newParams?: ActionParams) {
      // Update logic
    },
    destroy() {
      // Cleanup
      node.removeEventListener('event', handler);
    },
  };
}
```

### Utility Functions

- Pure functions when possible
- Single responsibility
- Well-typed inputs and outputs
- Include `.ts` extension in imports

```typescript
export function findRegionalIntl(props: ToMediaOrEpisodeIntlProps) {
  const { region } = getLanguageAndRegion();
  // ... implementation
  return result;
}
```

## Code Quality

### ESLint Configuration

- Use TypeScript ESLint recommended rules
- Svelte plugin enabled
- Unused variables prefixed with `_` are allowed:

```typescript
const { _unused, used } = props;
```

### Best Practices

#### Prefer Composition

```typescript
// Good
<Button onclick={handleClick} label={label} />

// Avoid complex inline handlers
<button onclick={() => { /* complex logic */ }}>
```

#### Type Guards

```typescript
if (props.type === 'episode') {
  // TypeScript narrows the type
  const episodes = props.media.episodes;
}
```

#### Conditional Rendering

```svelte
<!-- Prefer {#if} over && -->
{#if condition}
  <Component />
{/if}

<!-- Not: {condition && <Component />} -->
```

### Performance Considerations

- Use `$derived()` for computed values (cached)
- Lazy load components when appropriate
- Avoid unnecessary reactive statements
- Use actions for DOM manipulation instead of reactive statements
