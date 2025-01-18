<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
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

  const { list } = usePopularList({ type });
</script>

<SectionList
  id={`popular-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton href={UrlBuilder.popular({ type })} label={drilldownLabel} />
  {/snippet}
</SectionList>
