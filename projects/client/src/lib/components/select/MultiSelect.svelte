<script lang="ts">
  import SelectBase from "./_internal/SelectBase.svelte";
  import SelectItem from "./_internal/SelectItem.svelte";
  import type { MultiSelectProps } from "./models/MultiSelectProps";

  const {
    options,
    value = [],
    placeholder,
    disabled = false,
    searchPlaceholder,
    emptyLabel,
    optionLeading,
    hasOptionLeading = () => true,
    onChange,
  }: MultiSelectProps = $props();

  let search = $state("");

  const normalizedSearch = $derived(search.trim().toLowerCase());
  const visibleOptions = $derived(
    normalizedSearch
      ? options.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearch)
      )
      : options,
  );

  const selectedLabel = $derived(
    value.length
      ? options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label)
        .join(", ")
      : placeholder,
  );

  function stopSelectKeyboardHandling(event: KeyboardEvent) {
    if (event.key === "Escape" || event.key === "Tab") {
      return;
    }

    event.stopPropagation();
  }
</script>

{#snippet searchField()}
  <div class="trakt-select-search">
    <input
      bind:value={search}
      type="search"
      placeholder={searchPlaceholder}
      aria-label={searchPlaceholder}
      onkeydown={stopSelectKeyboardHandling}
      onclick={(event) => event.stopPropagation()}
    />
  </div>
{/snippet}

<SelectBase
  type="multiple"
  {value}
  {placeholder}
  {disabled}
  triggerLabel={selectedLabel}
  hasValue={value.length > 0}
  onValueChange={onChange}
  header={searchPlaceholder ? searchField : undefined}
>
  {#each visibleOptions as option (option.value)}
    <SelectItem
      {option}
      leading={optionLeading && hasOptionLeading(option)
        ? optionLeading
        : undefined}
    />
  {/each}
  {#if visibleOptions.length === 0 && emptyLabel}
    <div class="trakt-select-empty">
      {emptyLabel}
    </div>
  {/if}
</SelectBase>

<style lang="scss">
  .trakt-select-search {
    --color-select-search-background: var(--shade-50);
    --color-select-search-border: var(--shade-200);
    --color-select-search-foreground: var(--shade-920);
    --color-select-search-placeholder: var(--shade-700);

    padding: var(--ni-4) var(--ni-4) var(--ni-8);

    input {
      width: 100%;
      min-width: 0;
      height: var(--ni-36);
      padding-inline: var(--ni-10);
      box-sizing: border-box;
      font-size: var(--font-size-text);

      border: var(--border-thickness-xxs) solid
        var(--color-select-search-border);
      border-radius: var(--border-radius-s);

      background: var(--color-select-search-background);
      color: var(--color-select-search-foreground);
      color-scheme: light;
      outline: none;

      &::placeholder {
        color: var(--color-select-search-placeholder);
      }

      &:focus-visible {
        border-color: var(--color-input-focus);
        outline: var(--border-thickness-xs) solid var(--color-input-focus);
        outline-offset: var(--border-thickness-xs);
      }
    }
  }

  .trakt-select-empty {
    margin: 0;
    padding: var(--ni-12) var(--ni-8);
    font-size: var(--font-size-tag);
    color: var(--shade-700);
    text-align: center;
  }
</style>
