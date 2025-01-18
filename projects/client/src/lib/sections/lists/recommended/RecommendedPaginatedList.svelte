<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { RECOMMENDED_UPPER_LIMIT } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { toInMemoryPaginatable } from "./toInMemoryPaginatable";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendedListProps = $props();
  const useInMemoryRecommendedList = $derived(
    toInMemoryPaginatable({
      useList: useRecommendedList,
      total: RECOMMENDED_UPPER_LIMIT,
      type,
    }),
  );
</script>

<DrilledMediaList
  {title}
  {type}
  useList={useInMemoryRecommendedList}
  urlBuilder={UrlBuilder.recommended}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</DrilledMediaList>
