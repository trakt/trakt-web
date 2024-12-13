<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import RecommendedMedia from "../recommendations/RecommendedMedia.svelte";
  import { useTrendingList } from "./stores/useTrendingList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const { list } = useTrendingList({ type });
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
