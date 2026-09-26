<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    isActive,
    onclick,
  }: {
    isActive: boolean;
    onclick: () => void;
  } = $props();
</script>

<ActionButton
  style="ghost"
  label={m.button_label_search_lists()}
  classList={isActive ? "trakt-link-active" : ""}
  aria-pressed={isActive ? "true" : "false"}
  {onclick}
>
  <SearchIcon />
</ActionButton>
