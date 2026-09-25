<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import type { ListSearchButtonProps } from "./models/ListSearchButtonProps.ts";

  const { isActive, copy, onclick }: ListSearchButtonProps = $props();
</script>

<ActionButton
  style="ghost"
  label={copy.toggle}
  classList={isActive ? "trakt-link-active" : ""}
  aria-pressed={isActive ? "true" : "false"}
  {onclick}
>
  <SearchIcon />
</ActionButton>
