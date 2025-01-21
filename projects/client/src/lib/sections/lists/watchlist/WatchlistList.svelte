<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import MediaCard from "../components/MediaCard.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import { useWatchlistList } from "./useWatchlistList";

  type WatchlistListProps = {
    title: string;
    type: MediaType;
    emptyMessage: string;
  };

  const { title, type, emptyMessage }: WatchlistListProps = $props();

  const { list, isLoading } = useWatchlistList({ type });
</script>

<SectionList
  id={`watchlist-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaCard {type} {media} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small secondary">
        {emptyMessage}
      </p>
    {/if}
  {/snippet}
</SectionList>
