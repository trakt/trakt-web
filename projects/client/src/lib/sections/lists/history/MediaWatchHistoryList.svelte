<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaList from "../drilldown/MediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    type: MediaType | "episode";
    media: MediaEntry | EpisodeEntry;
  };

  const { title, type, media }: RecentlyWatchedListProps = $props();
</script>

<RenderFor audience="authenticated">
  <MediaList
    id="media-watch-history-list-{type}-{media.id}"
    {title}
    type="episode"
    useList={({ limit, page }) =>
      useRecentlyWatchedList({
        type,
        limit,
        page,
        id: media.id,
      })}
  >
    {#snippet item(media)}
      <RecentlyWatchedItem {media} />
    {/snippet}

    {#snippet empty()}
      <p>{m.empty_media_history_label({ title: media.title })}</p>
    {/snippet}
  </MediaList>
</RenderFor>
