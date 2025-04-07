<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import StreamingListItem from "./StreamingListItem.svelte";
  import { useStreamingList } from "./useStreamingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();
</script>

<DrillableMediaList
  id="streaming-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  useList={useStreamingList}
  urlBuilder={UrlBuilder.streaming}
>
  {#snippet item(media)}
    <StreamingListItem {type} {media} />
  {/snippet}
</DrillableMediaList>
