<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import RecommendedMedia from "../recommendations/RecommendedMedia.svelte";
  import { usePopularList } from "./stores/usePopularList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type PopularListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: PopularListProps = $props();

  const { list } = usePopularList({ type });
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
