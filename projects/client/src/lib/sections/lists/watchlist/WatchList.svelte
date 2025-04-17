<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
  import { statusToStore } from "./statusToStore";
  import WatchlistItem from "./WatchlistItem.svelte";

  type WatchListProps = {
    title: string;
    type: MediaType;
    drilldownLabel: string;
    empty?: Snippet;
    status: "all" | "released" | "unreleased";
  };

  const { title, type, status, drilldownLabel }: WatchListProps = $props();
  const { filterMap } = useFilter();

  const useList = $derived.by(() => statusToStore(status));
</script>

<DrillableMediaList
  id="watch-list-{type}-{status}"
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {useList}
  urlBuilder={(params) =>
    `${UrlBuilder.watchlistPage(params)}?status=${status}`}
>
  {#snippet item(media)}
    <WatchlistItem {type} {media} />
  {/snippet}

  {#snippet empty()}
    <EmptyWatchlist {type} {status} />
  {/snippet}
</DrillableMediaList>
