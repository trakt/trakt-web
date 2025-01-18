<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecommendedMediaItem from "./RecommendedMediaItem.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendationListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: RecommendationListProps = $props();
</script>

<DrillableMediaList
  {title}
  {drilldownLabel}
  {type}
  useList={useRecommendedList}
  urlBuilder={UrlBuilder.recommended}
>
  {#snippet item(media)}
    <RecommendedMediaItem {type} {media} style="card" />
  {/snippet}
</DrillableMediaList>
