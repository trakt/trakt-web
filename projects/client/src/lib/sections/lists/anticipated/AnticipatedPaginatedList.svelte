<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: AnticipatedListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-anticipated-${type}"
  {title}
  {type}
  useList={useAnticipatedList}
>
  {#snippet item(media)}
    <AnticipatedListItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
