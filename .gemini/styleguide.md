# Project Coding Standards

## Tech Stack
- SvelteKit + TypeScript project, using Svelte 5 in runes mode.

## Naming Conventions

### General Rules
- **PascalCase**: Component names, interfaces, and type aliases
- **camelCase**: Variables, functions, and methods
- **ALL_CAPS**: Constants

### File Naming
- Components: PascalCase (e.g., `ClampedText.svelte`, `MoreButton.svelte`)
- Utilities/helpers: camelCase (e.g., `lineClamp.ts`, `clickOutside.ts`)
- Type definitions: PascalCase (e.g., `MediaStoreProps.ts`, `FilterParams.ts`)

## Commit Standards
- **Follow Conventional Commits**: All commits must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - Use types: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, etc.
  - Example: `feat: add user profile component`
  - Example: `fix: correct date formatting in calendar view`

## Code Principles

### Functional Programming
- **Write functional code**: Prefer pure functions that avoid side effects when possible.
- Functions should return consistent output for the same input.
- Minimize state mutation and favor immutable data structures.
- Keep Svelte stores minimal; use `$derived()` for computed values.

### Immutability
- **Prefer `const` over `let`**: Use `const` whenever possible.
- Avoid reassigning variables.
- Use array methods like `map`, `filter`, and `reduce` instead of mutating loops.
- Use TypeScript's `readonly` types: `Readonly<T>`, `ReadonlyArray<T>`, `ReadonlyMap`, `ReadonlySet`.

**Bad:**
```typescript
let result = [];
for (let i = 0; i < items.length; i++) {
  result.push(transform(items[i]));
}
```

**Good:**
```typescript
const result = items.map(transform);
```

### Early Exits
- **Use guard clauses and early returns**: Check error conditions first and return early.
- Avoid deep nesting by handling edge cases at the start of functions.

**Bad:**
```typescript
function processData(data: Data | null) {
  if (data) {
    if (data.isValid) {
      if (data.hasPermission) {
        return transform(data);
      }
    }
  }
  return null;
}
```

**Good:**
```typescript
function processData(data: Data | null) {
  if (!data) return null;
  if (!data.isValid) return null;
  if (!data.hasPermission) return null;

  return transform(data);
}
```

### Code Smells to Avoid
- **No nested if statements**: Nested conditionals indicate poor architecture.
  - Refactor into separate functions with clear responsibilities.
  - Use guard clauses and early returns instead.
- **No abstraction leaks**: Ensure abstractions hide implementation details completely.
- **No "god functions"**: Each function should have a single, clear responsibility.

### Function Design
- **Single Responsibility Principle**: Each function should do one thing well.
- Function names should clearly describe what they do.
- When a function takes 3+ parameters, use a single object parameter.
- Pass dependencies as parameters (dependency injection).

**Bad:**
```typescript
fetchData(url, token, retry, timeout);
```

**Good:**
```typescript
fetchData({ url, token, retry, timeout });
```

### Dependency Injection
- **Pass dependencies as parameters**: Don't instantiate external services inside functions.
- Makes functions testable without mocking.
- Use interface types to define the shape of dependencies.

**Bad:**
```typescript
export function fetchUser(id: string) {
  const api = new ApiClient();
  return api.get(`/users/${id}`);
}
```

**Good:**
```typescript
interface FetchUserParams {
  api: ApiClient;
  id: string;
}

export function fetchUser({ api, id }: FetchUserParams) {
  return api.get(`/users/${id}`);
}
```

### Separation of Concerns
- **Push side effects to the edges**: Keep core logic pure and deterministic.
- API calls, local storage, and DOM manipulation are side effects.
- Pure functions should handle data transformation only.
- Side effects should live in the outer layers (components, hooks, server functions).

### Simplicity
- **Keep it simple**: Simple code is maintainable code.
- Suggestions should be simple and functional with low visual complexity.
- Split up into smaller functions when needed.
- Favor readability over cleverness.
- If a solution feels complex, step back and reconsider the approach.

### Iteration Patterns
- **Prefer functional methods over imperative loops**: Use `map`, `filter`, `reduce`.
- Avoid mutable loop counters when possible.

## TypeScript Standards

### Type Safety
- Always use TypeScript with strict mode.
- No `any` types; use specific types or utility types.

### Type Definitions

#### Props Types
```typescript
type LineClampProps = {
  label: string;
  classList?: string;
} & ChildrenProps;

const { children, label, classList = '' }: LineClampProps = $props();
```

#### Union Types
```typescript
export type MediaStoreProps<T extends { id: number } = { id: number }> =
  | EpisodeProps<T>
  | ShowProps<T>
  | MovieProps<T>;
```

#### Utility Types
```typescript
type FilterParams = DeepPartial<{
  filter: FilterParam;
  filterOverride?: FilterOverrideParams;
}>;
```

### Zod Schemas
- Use Zod for runtime validation and type inference.
- Define schema first, then derive type:

```typescript
export const MediaIntlSchema = EpisodeIntlSchema.extend({
  tagline: z.string().nullish(),
});
export type MediaIntl = z.infer<typeof MediaIntlSchema>;
```

### Null Handling
- Use `Nil` type for `null | undefined`.
- Use `.nullish()` in Zod schemas for optional nullable fields.
- Use optional chaining (`?.`) and nullish coalescing (`??`).

## Svelte 5 Runes Mode

### Reactive State with Runes

#### `$props()`
```typescript
const { children, label, classList = '' }: LineClampProps = $props();
```

#### `$derived()`
```typescript
const isExpanded = $derived($lines === 1337);
const hasValidRating = $derived(rating !== undefined);
const title = $derived(intl?.title ?? media?.title ?? '');

// Destructure from functions/objects:
const { isCollapsed, toggle } = $derived(useCollapsedList(id));
```

### Component Structure

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

### Snippets

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

### Custom Hooks Pattern

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

### SCSS with Scoped Styles

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
- Use kebab-case for CSS classes.
- Descriptive, semantic names.
- Component-scoped styles preferred.

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

```typescript
export function actionName(node: HTMLElement, params?: ActionParams) {
  function handler(event: Event) { ... }

  node.addEventListener('event', handler);

  return {
    update(newParams?: ActionParams) { ... },
    destroy() {
      node.removeEventListener('event', handler);
    },
  };
}
```

### Utility Functions
- Pure functions when possible.
- Single responsibility.
- Well-typed inputs and outputs.
- Include `.ts` extension in imports.

## Code Quality

### ESLint
- TypeScript ESLint recommended rules.
- Svelte plugin enabled.
- Unused variables prefixed with `_` are allowed.

### Best Practices

#### Prefer Composition
```typescript
<Button onclick={handleClick} label={label} />
```

#### Type Guards
```typescript
if (props.type === 'episode') {
  const episodes = props.media.episodes;
}
```

#### Conditional Rendering
```svelte
{#if condition}
  <Component />
{/if}
```

### Performance
- Use `$derived()` for computed values (cached).
- Lazy load components when appropriate.
- Avoid unnecessary reactive statements.
- Use actions for DOM manipulation instead of reactive statements.
