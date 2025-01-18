<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { RECOMMENDED_UPPER_LIMIT } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import RecommendedMediaItem from "./RecommendedMediaItem.svelte";
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
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <RecommendedMediaItem {type} {media} style="card" />
    </RenderFor>

    <RenderFor audience="all" device={["mobile"]}>
      <RecommendedMediaItem {type} {media} style="list" />
    </RenderFor>
  {/snippet}
</DrilledMediaList>
