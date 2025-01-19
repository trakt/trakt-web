<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularMediaItem from "./PopularMediaItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: PopularListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "list" : "card");
</script>

<DrilledMediaList
  {title}
  {type}
  useList={usePopularList}
  urlBuilder={UrlBuilder.popular}
>
  {#snippet item(media)}
    <PopularMediaItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
