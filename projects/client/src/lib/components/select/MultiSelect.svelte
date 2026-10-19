<script lang="ts">
  import SelectBase from "./_internal/SelectBase.svelte";
  import SelectItem from "./_internal/SelectItem.svelte";
  import type { MultiSelectProps } from "./models/MultiSelectProps.ts";
  import type { MultiSelectState } from "./models/MultiSelectState.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import LoaderIcon from "$lib/components/icons/LoaderIcon.svelte";

  const {
    options,
    included = [],
    excluded = [],
    placeholder,
    disabled = false,
    variant = "default",
    searchPlaceholder,
    emptyLabel,
    isLoading = false,
    onSearch,
    onChange,
  }: MultiSelectProps = $props();

  const includedSet = $derived(new Set(included));
  const excludedSet = $derived(new Set(excluded));

  /*
    bits-ui treats included and excluded values alike as "selected", so both
    stay highlighted in the list. The tri-state cycle is resolved on change.
  */
  const value = $derived([...included, ...excluded]);

  const stateOf = (optionValue: string): MultiSelectState | undefined => {
    if (includedSet.has(optionValue)) return "included";
    if (excludedSet.has(optionValue)) return "excluded";
    return undefined;
  };

  let search = $state("");

  const statusText = $derived.by(() => {
    if (isLoading) return m.text_select_searching();
    if (options.length === 0) return emptyLabel ?? "";
    return "";
  });

  const normalizedSearch = $derived(search.trim().toLowerCase());
  const visibleOptions = $derived(
    normalizedSearch && !onSearch
      ? options.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearch)
      )
      : options,
  );

  const selectedLabel = $derived(
    value.length
      ? options
        .filter(
          (option) =>
            includedSet.has(option.value) || excludedSet.has(option.value),
        )
        .map((option) =>
          excludedSet.has(option.value)
            ? m.option_text_excluded({ label: option.label })
            : option.label
        )
        .join(", ")
      : placeholder,
  );

  const setState = (
    optionValue: string,
    next: MultiSelectState | undefined,
  ) => {
    const withoutOption = (list: string[]) =>
      list.filter((current) => current !== optionValue);

    onChange({
      included: next === "included"
        ? [...withoutOption(included), optionValue]
        : withoutOption(included),
      excluded: next === "excluded"
        ? [...withoutOption(excluded), optionValue]
        : withoutOption(excluded),
    });
  };

  /*
    Clicking or keyboard-toggling a row handles inclusion: an untouched option
    becomes included, an already included/excluded one clears. Exclusion is
    driven explicitly by the per-row toggle buttons via setState.
  */
  const onRowToggle = (next: string[]) => {
    const nextSet = new Set(next);
    const toggled = value.find((current) => !nextSet.has(current)) ??
      next.find((current) => !stateOf(current));

    if (!toggled) return;

    setState(toggled, stateOf(toggled) === undefined ? "included" : undefined);
  };

  const listNavigationKeys = new Set([
    "Escape",
    "Tab",
    "ArrowDown",
    "ArrowUp",
    "Enter",
  ]);

  function stopSelectKeyboardHandling(event: KeyboardEvent) {
    if (listNavigationKeys.has(event.key)) {
      return;
    }

    event.stopPropagation();
  }
</script>

{#snippet searchField()}
  <div class="trakt-select-search" aria-busy={isLoading}>
    <input
      bind:value={search}
      oninput={(event) => onSearch?.(event.currentTarget.value)}
      type="search"
      placeholder={searchPlaceholder}
      aria-label={searchPlaceholder}
      onkeydown={stopSelectKeyboardHandling}
      onclick={(event) => event.stopPropagation()}
    />
    {#if isLoading}
      <span class="trakt-select-search-loader" aria-hidden="true">
        <LoaderIcon />
      </span>
    {/if}
  </div>
{/snippet}

<SelectBase
  type="multiple"
  {value}
  {placeholder}
  {disabled}
  triggerLabel={selectedLabel}
  hasValue={value.length > 0}
  onValueChange={onRowToggle}
  header={searchPlaceholder ? searchField : undefined}
  {variant}
  autoWidth
>
  {#each visibleOptions as option (option.value)}
    <SelectItem
      {option}
      state={stateOf(option.value)}
      onCommit={(next) => setState(option.value, next)}
    />
  {/each}
  {#if visibleOptions.length === 0 && emptyLabel && !isLoading}
    <div class="trakt-select-empty">
      {emptyLabel}
    </div>
  {/if}
  {#if onSearch}
    <div class="trakt-select-status" role="status">{statusText}</div>
  {/if}
</SelectBase>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-select-search {
    --color-select-search-background: var(--color-select-raised-background);
    --color-select-search-border: var(--color-border);
    --color-select-search-foreground: var(--color-foreground);
    --color-select-search-placeholder: var(--color-select-muted-foreground);

    position: relative;
    padding: var(--ni-4) var(--ni-4) var(--ni-8);

    input {
      width: 100%;
      min-width: 0;
      height: var(--ni-40);
      padding-inline: var(--ni-12);
      box-sizing: border-box;
      font-size: var(--font-size-text);

      border: var(--border-thickness-xxs) solid
        var(--color-select-search-border);
      border-radius: var(--border-radius-field);

      background: var(--color-select-search-background);
      color: var(--color-select-search-foreground);
      outline: none;

      transition: border-color var(--transition-increment) ease-in-out;

      &::placeholder {
        color: var(--color-select-search-placeholder);
      }

      &:focus-within {
        border-color: var(--color-input-focus);
      }
    }

    &[aria-busy="true"] input {
      padding-inline-end: var(--ni-36);
    }
  }

  .trakt-select-search-loader {
    position: absolute;
    inset-block-start: var(--ni-4);
    inset-inline-end: var(--ni-4);

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-36);
    height: var(--ni-40);

    color: var(--color-select-muted-foreground);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .trakt-select-status {
    @include visually-hidden;
  }

  .trakt-select-empty {
    margin: 0;
    padding: var(--ni-12) var(--ni-8);
    font-size: var(--font-size-tag);
    color: var(--color-select-muted-foreground);
    text-align: center;
  }
</style>
