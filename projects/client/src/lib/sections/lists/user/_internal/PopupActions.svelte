<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";

  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { ListParams } from "../useListItems";
  import RemoveFromListAction from "./RemoveFromListAction.svelte";

  const { list, media }: { list: ListParams; media: MediaEntry } = $props();
  const { current } = useUser();

  const isMyList = $derived(list.user?.slug === current().slug);
</script>

<RenderFor audience="authenticated">
  {#if isMyList && list.slug}
    <RemoveFromListAction
      listId={list.slug}
      title={media.title}
      type={media.type}
      {media}
    />
  {/if}
  <WatchlistAction
    style="dropdown-item"
    title={media.title}
    type={media.type}
    {media}
  />
  <MarkAsWatchedAction
    style="dropdown-item"
    title={media.title}
    type={media.type}
    {media}
  />
</RenderFor>
