<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TrendingMediaItem from "./TrendingMediaItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "list" : "card");
</script>

<DrilledMediaList
  {title}
  {type}
  useList={useTrendingList}
  urlBuilder={UrlBuilder.trending}
>
  {#snippet item(media)}
    <TrendingMediaItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
