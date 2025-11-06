<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import ListDropdown from "$lib/sections/summary/components/list-dropdown/ListDropdown.svelte";
  import { useAllPersonalLists } from "$lib/sections/summary/components/list-dropdown/useAllPersonalLists";

  const { media }: { media: MediaEntry } = $props();

  const listProps = $derived({
    title: media.title,
    type: media.type,
    media,
    style: "action" as const,
  });

  const { lists, isLoading } = useAllPersonalLists();
</script>

{#if $lists.length === 0}
  <WatchlistAction {...listProps} isLoadingLists={$isLoading} />
{:else}
  <ListDropdown {...listProps} lists={$lists} isLoadingLists={$isLoading} />
{/if}
