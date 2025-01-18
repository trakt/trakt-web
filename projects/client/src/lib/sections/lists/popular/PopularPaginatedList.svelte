<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularMediaItem from "./PopularMediaItem.svelte";
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
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <PopularMediaItem {type} {media} style="card" />
    </RenderFor>

    <RenderFor audience="all" device={["mobile"]}>
      <PopularMediaItem {type} {media} style="list" />
    </RenderFor>
  {/snippet}
</DrilledMediaList>
