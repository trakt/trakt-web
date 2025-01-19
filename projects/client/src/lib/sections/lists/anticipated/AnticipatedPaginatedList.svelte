<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AnticipatedMediaItem from "./AnticipatedMediaItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: AnticipatedListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "list" : "card");
</script>

<DrilledMediaList
  {title}
  {type}
  useList={useAnticipatedList}
  urlBuilder={UrlBuilder.anticipated}
>
  {#snippet item(media)}
    <AnticipatedMediaItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
