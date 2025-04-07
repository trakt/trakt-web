<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import StreamingListItem from "./StreamingListItem.svelte";
  import { useStreamingList } from "./useStreamingList";

  type StreamingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: StreamingListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-streaming-${type}"
  {title}
  {type}
  useList={useStreamingList}
>
  {#snippet item(media)}
    <StreamingListItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
