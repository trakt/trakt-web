<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import MediaItem from "./components/MediaItem.svelte";
  import { useWatchlistList } from "./stores/useWatchlistList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type WatchlistListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: WatchlistListProps = $props();

  const { list } = useWatchlistList({ type });
</script>

<SectionList
  items={$list}
  {title}
  --height-section-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</SectionList>
