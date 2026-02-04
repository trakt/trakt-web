<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";

  const { media }: { media: MediaEntry } = $props();

  const listProps = $derived({
    title: media.title,
    type: media.type,
    media,
    style: "action" as const,
  });

  const { lists, isLoading } = useAllPersonalLists();

  // FIXME: replace this when we store states in session storage
  let isUpdating = $state(false);
  let isListsDrawerOpen = $state(false);
</script>

{#if $lists.length === 0}
  <WatchlistAction {...listProps} isLoadingLists={$isLoading} />
{:else}
  <ListAction
    {...listProps}
    onClick={() => (isListsDrawerOpen = true)}
    disabled={isUpdating}
  />
{/if}

{#if isListsDrawerOpen}
  <ListsDrawer
    onClose={() => (isListsDrawerOpen = false)}
    {media}
    title={media.title}
    mode="auto-watchlist"
    onLoading={(loading) => (isUpdating = loading)}
  />
{/if}
