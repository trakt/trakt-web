<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import RecommendedMedia from "./RecommendedMedia.svelte";

  import type { MediaType } from "$lib/models/MediaType";
  import { useRecommendationList } from "./stores/useRecommendationList";

  type RecommendationListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendationListProps = $props();

  const { list } = useRecommendationList({ type });
</script>

<SectionList {title} --height-section-list="var(--height-poster-list)">
  {#each $list as recommendation (recommendation.id)}
    <RecommendedMedia {type} {recommendation} />
  {/each}
</SectionList>
