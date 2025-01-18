<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: PopularListProps = $props();
</script>

<DrilledMediaList
  {title}
  {type}
  useList={usePopularList}
  urlBuilder={UrlBuilder.popular}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</DrilledMediaList>
