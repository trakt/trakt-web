<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import type { DrawerSearchInputProps } from "./DrawerSearchInputProps";

  let { value = $bindable(""), label, placeholder }: DrawerSearchInputProps =
    $props();
</script>

<label class="trakt-drawer-search-input">
  <SearchIcon />
  <input
    bind:value
    type="search"
    aria-label={label}
    {placeholder}
  />
</label>

<style lang="scss">
  .trakt-drawer-search-input {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    cursor: text;

    margin-block: var(--drawer-search-input-margin-block, 0);
    min-height: var(--ni-48);
    padding: 0 var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    background: var(--color-input-background);
    outline: var(--border-thickness-xxs) solid var(--color-border);

    transition: outline var(--transition-increment) ease-in-out;

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--color-input-focus);
    }

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-24);
      height: var(--ni-24);
      color: var(--color-text-secondary);
    }

    input {
      all: unset;
      min-width: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
