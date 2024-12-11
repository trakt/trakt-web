<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import RecommendedMedia from "../recommendations/RecommendedMedia.svelte";
  import { useAnticipatedList } from "./stores/useAnticipatedList";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const { list } = useAnticipatedList({ type });
</script>

<SectionList {title} --height-section-list="var(--height-poster-list)">
  {#each $list as trendingItem (trendingItem.id)}
    <RecommendedMedia {type} recommendation={trendingItem} />
  {/each}
</SectionList>
