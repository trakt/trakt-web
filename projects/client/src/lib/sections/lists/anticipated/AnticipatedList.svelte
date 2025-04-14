<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="anticipated-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={useAnticipatedList}
  urlBuilder={UrlBuilder.anticipated}
>
  {#snippet item(media)}
    <AnticipatedListItem {type} {media} />
  {/snippet}
</DrillableMediaList>
