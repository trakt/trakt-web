<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ListItem } from "$lib/requests/models/ListItem";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";

  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import RemoveFromListAction from "./RemoveFromListAction.svelte";

  const { list, listedItem }: { list: MediaListSummary; listedItem: ListItem } =
    $props();
  const { user } = useUser();

  const isMyList = $derived(list.user?.slug === $user.slug);

  const target = $derived.by(() => {
    if (listedItem.type === "movie" || listedItem.type === "show") {
      return {
        type: listedItem.type,
        media: listedItem.entry,
        title: listedItem.entry.title,
      };
    }

    if (listedItem.type === "season") {
      const season = listedItem.entry.season;
      return {
        type: listedItem.type,
        media: season,
        title: `${listedItem.entry.show.title} ${seasonLabel(season.number)}`,
      };
    }

    if (listedItem.type === "episode") {
      const episode = listedItem.entry.episode;
      return {
        type: listedItem.type,
        media: episode,
        show: listedItem.entry.show,
        title: `${listedItem.entry.show.title} ${episodeNumberLabel({
          seasonNumber: episode.season,
          episodeNumber: episode.number,
        })}`,
      };
    }
  });
</script>

<RenderFor audience="authenticated">
  {#if isMyList && target}
    <RemoveFromListAction {list} {target} />
  {/if}

  {#if listedItem.type === "movie" || listedItem.type === "show"}
    <WatchlistAction
      style="dropdown-item"
      title={listedItem.entry.title}
      type={listedItem.entry.type}
      media={listedItem.entry}
    />
    <MarkAsWatchedAction
      style="dropdown-item"
      title={listedItem.entry.title}
      type={listedItem.entry.type}
      media={listedItem.entry}
    />
  {/if}
</RenderFor>
