<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";

  import type { MediaType } from "$lib/models/MediaType";
  import RecommendedMedia from "./components/RecommendedMedia.svelte";
  import { useRecommendationList } from "./stores/useRecommendationList";

  type RecommendationListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendationListProps = $props();

  const { list } = useRecommendationList({ type });
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
