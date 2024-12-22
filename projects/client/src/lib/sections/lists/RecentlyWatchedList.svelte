<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import MediaItem from "./components/MediaItem.svelte";
  import { useRecentlyWatchedList } from "./stores/useRecentlyWatchedList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type WatchlistListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: WatchlistListProps = $props();

  const { list } = useRecentlyWatchedList({ type });
</script>

<SectionList
  id={`recently-watched-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</SectionList>
