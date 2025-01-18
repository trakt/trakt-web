<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import AnticipatedMediaItem from "./AnticipatedMediaItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();
</script>

<DrillableMediaList
  {title}
  {drilldownLabel}
  {type}
  useList={useAnticipatedList}
  urlBuilder={UrlBuilder.anticipated}
>
  {#snippet item(media)}
    <AnticipatedMediaItem {type} {media} />
  {/snippet}
</DrillableMediaList>
