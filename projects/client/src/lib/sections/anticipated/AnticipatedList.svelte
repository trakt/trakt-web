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

<SectionList
  items={$list}
  {title}
  --height-section-list="var(--height-poster-list)"
>
  {#snippet item(recommendation)}
    <RecommendedMedia {type} {recommendation} />
  {/snippet}
</SectionList>
