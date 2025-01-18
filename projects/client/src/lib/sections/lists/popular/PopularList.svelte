<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularMediaItem from "./PopularMediaItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: PopularListProps = $props();
</script>

<DrillableMediaList
  {title}
  {drilldownLabel}
  {type}
  useList={usePopularList}
  urlBuilder={UrlBuilder.popular}
>
  {#snippet item(media)}
    <PopularMediaItem {type} {media} style="card" />
  {/snippet}
</DrillableMediaList>
