<script lang="ts">
  import SearchField from "$lib/components/form/SearchField.svelte";
  import type { SearchFieldVariant } from "$lib/components/form/models/SearchFieldVariant.ts";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    value,
    variant = "default",
    onInput,
    onClose,
  }: {
    value: string;
    variant?: SearchFieldVariant;
    onInput: (value: string) => void;
    onClose: () => void;
  } = $props();

  function oninput(event: Event) {
    onInput((event.currentTarget as HTMLInputElement).value);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;

    onClose();
  }
</script>

<div class="trakt-list-search-input" role="search" data-variant={variant}>
  <SearchField
    {variant}
    defaultValue={value}
    label={m.input_label_search_lists()}
    placeholder={m.input_placeholder_search_lists()}
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
