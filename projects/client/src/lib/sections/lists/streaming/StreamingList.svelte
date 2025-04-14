<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import StreamingListItem from "./StreamingListItem.svelte";
  import { useStreamingList } from "./useStreamingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();
  const { user } = useUser();
  const { filterMap } = useFilter();

  const hasFavorites = $derived(($user?.services.favorites ?? []).length > 0);
</script>

{#if hasFavorites}
  <DrillableMediaList
    id="streaming-list-{type}"
    {title}
    {drilldownLabel}
    {type}
    filter={$filterMap}
    useList={useStreamingList}
    urlBuilder={UrlBuilder.streaming}
  >
    {#snippet item(media)}
      <StreamingListItem {type} {media} />
    {/snippet}
  </DrillableMediaList>
{/if}
