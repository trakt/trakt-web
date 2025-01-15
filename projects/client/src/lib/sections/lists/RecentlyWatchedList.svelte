<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import MediaItem from "./components/MediaItem.svelte";
  import { useRecentlyWatchedList } from "./stores/useRecentlyWatchedList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type RecentlyWatchedListProps = {
    title: string;
    type: "movie" | "episode";
  };

  const { title, type }: RecentlyWatchedListProps = $props();

  const { list } = useRecentlyWatchedList({ type });
</script>

<SectionList
  id={`recently-watched-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    {#if media.type === "episode"}
      <EpisodeItem
        episode={media.episode}
        show={media.show}
        context="standalone"
      />
    {/if}

    {#if media.type === "movie"}
      <MediaItem type={"movie"} media={media.movie} />
    {/if}
  {/snippet}
</SectionList>
