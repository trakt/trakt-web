<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./components/EpisodeCard.svelte";
  import MediaCard from "./components/MediaCard.svelte";
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
      <EpisodeCard
        episode={media.episode}
        show={media.show}
        context="standalone"
        type="default"
      />
    {/if}

    {#if media.type === "movie"}
      <MediaCard type={media.type} media={media.movie}>
        {#snippet action()}
          <RenderFor audience="authenticated">
            <MarkAsWatchedAction
              style="action"
              title={media.movie.title}
              type={media.type}
              media={media.movie}
            />
          </RenderFor>
        {/snippet}
      </MediaCard>
    {/if}
  {/snippet}
</SectionList>
