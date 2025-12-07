<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import {
    useWatchCount,
    type UseWatchCountProps,
  } from "$lib/stores/useWatchCount";
  import MediaList from "../drilldown/MediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const MINIMUM_WATCH_COUNT = 2;

  type RecentlyWatchedListProps = {
    title: string;
  } & UseWatchCountProps;

  const { title, ...target }: RecentlyWatchedListProps = $props();

  const { watchCount } = $derived(useWatchCount(target));
  const targetItem = $derived(
    target.type === "episode" ? target.episode : target.media,
  );
</script>

<RenderFor audience="authenticated">
  {#if $watchCount >= MINIMUM_WATCH_COUNT}
    <MediaList
      id="media-watch-history-list-{target.type}-{targetItem.id}"
      {title}
      type="episode"
      useList={({ limit }) =>
        useRecentlyWatchedList({
          type: target.type,
          limit,
          id: targetItem.id,
        })}
    >
      {#snippet item(media)}
        <RecentlyWatchedItem {media} isActionable />
      {/snippet}

      {#snippet empty()}
        <p>{m.list_placeholder_media_history({ title: targetItem.title })}</p>
      {/snippet}
    </MediaList>
  {/if}
</RenderFor>
