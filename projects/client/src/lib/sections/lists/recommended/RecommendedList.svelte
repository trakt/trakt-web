<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
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
    <MediaItem {type} {media} />
  {/snippet}
</DrillableMediaList>
