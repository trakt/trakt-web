<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import RecommendedMedia from "./RecommendedMedia.svelte";

  import type { MediaType } from "$lib/models/MediaType";
  import { useRecommendationList } from "./stores/useRecommendationList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

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
  --height-section-list={mediaListHeightResolver(type)}
>
  {#snippet item(recommendation)}
    <RecommendedMedia {type} {recommendation} />
  {/snippet}
</SectionList>
