<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import RecommendedMedia from "./components/RecommendedMedia.svelte";
  import { usePopularList } from "./stores/usePopularList";

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
  --height-section-list="var(--height-poster-list)"
>
  {#snippet item(recommendation)}
    <RecommendedMedia {type} {recommendation} />
  {/snippet}
</SectionList>
