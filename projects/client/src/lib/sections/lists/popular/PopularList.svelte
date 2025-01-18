<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
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
    <MediaItem {type} {media} />
  {/snippet}
</DrillableMediaList>
