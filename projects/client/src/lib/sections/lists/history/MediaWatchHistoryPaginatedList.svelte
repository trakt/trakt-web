<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    type: ExtendedMediaType;
    media: MediaEntry | EpisodeEntry;
  };

  const { type, media }: RecentlyWatchedListProps = $props();
</script>

<DrilledMediaList
  id="media-watch-history-list-{type}"
  title={m.list_title_history()}
  {type}
  useList={(params) => useRecentlyWatchedList({ ...params, id: media.id })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</DrilledMediaList>
