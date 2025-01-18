<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TrendingMediaItem from "./TrendingMediaItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();
</script>

<DrilledMediaList
  {title}
  {type}
  useList={useTrendingList}
  urlBuilder={UrlBuilder.trending}
>
  {#snippet item(media)}
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <TrendingMediaItem {type} {media} style="card" />
    </RenderFor>

    <RenderFor audience="all" device={["mobile"]}>
      <Card>
        <TrendingMediaItem {type} {media} style="list" />
      </Card>
    </RenderFor>
  {/snippet}
</DrilledMediaList>
