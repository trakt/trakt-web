<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import TrendingMediaItem from "./TrendingMediaItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();

  const { list } = useTrendingList({ type });
</script>

<SectionList
  id={`trending-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <TrendingMediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      href={UrlBuilder.trending({ type })}
      label={drilldownLabel}
    />
  {/snippet}
</SectionList>
