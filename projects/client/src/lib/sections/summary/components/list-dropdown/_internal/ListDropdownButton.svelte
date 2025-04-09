<script lang="ts">
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ListDropdownButtonProps } from "./ListDropdownButtonProps";

  const {
    title,
    items: externalItems,
    style = "normal",
    isListed,
    ...props
  }: ListDropdownButtonProps = $props();

  const size = $derived(style === "action" ? "small" : "normal");
  const state = $derived(isListed ? "added" : "missing");
  const variant = $derived(isListed ? "primary" : "secondary");
  const text = $derived(isListed ? m.listed() : m.add_to_list());
</script>

<list-dropdown>
  <DropdownList
    label={title}
    {variant}
    text="capitalize"
    color="blue"
    style="flat"
    {size}
    {...props}
  >
    {#if style === "normal"}
      {text}
    {/if}

    {#snippet icon()}
      {#if style === "action"}
        <WatchlistIcon size="small" {state} />
      {/if}
    {/snippet}

    {#snippet items()}
      {@render externalItems()}
    {/snippet}
  </DropdownList>
</list-dropdown>

<style>
  list-dropdown {
    :global(.trakt-list) {
      min-width: var(--ni-220);
    }
  }
</style>
