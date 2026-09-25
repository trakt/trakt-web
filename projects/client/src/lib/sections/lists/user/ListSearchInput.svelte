<script lang="ts">
  import SearchField from "$lib/components/form/SearchField.svelte";
  import type { ListSearchInputProps } from "./models/ListSearchInputProps.ts";

  const { search, copy, variant = "default" }: ListSearchInputProps = $props();

  function oninput(event: Event) {
    search.term = (event.currentTarget as HTMLInputElement).value;
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;

    search.close();
  }
</script>

<div class="trakt-list-search-input" role="search" data-variant={variant}>
  <SearchField
    {variant}
    defaultValue={search.term}
    label={copy.label}
    placeholder={copy.placeholder}
    autofocus
    {oninput}
    {onkeydown}
  />
</div>

<style lang="scss">
  .trakt-list-search-input {
    display: flex;

    &[data-variant="default"] {
      justify-content: center;
      padding: 0 var(--layout-distance-side);
    }

    &[data-variant="embedded"] {
      width: 100%;
    }
  }
</style>
