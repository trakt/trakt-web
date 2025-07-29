<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TypeToggles from "./_internal/TypeToggles.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
  import { statusToStore } from "./statusToStore";
  import WatchlistItem from "./WatchlistItem.svelte";
  import type { WatchlistStatus } from "./WatchlistStatus";

  type WatchListProps = {
    title: string;
    type?: MediaType;
    status: WatchlistStatus;
    onTypeChange?: (types: MediaType[]) => void;
  };

  const { title, type, status, onTypeChange }: WatchListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
  const useList = $derived.by(() => statusToStore(status));
  const { filterMap } = useFilter();

  const selectedTypes = writable<MediaType[]>(
    type ? [type] : ["movie", "show"],
  );

  onMount(() => {
    if (!onTypeChange) {
      return;
    }

    const unsubscribe = selectedTypes.subscribe(onTypeChange);

    return () => {
      unsubscribe();
    };
  });
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  filter={$filterMap}
  {useList}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} {style} />
  {/snippet}

  {#snippet empty()}
    <EmptyWatchlist {type} {status} />
  {/snippet}

  {#snippet badge()}
    {#if status === "all" && onTypeChange}
      <TypeToggles types={selectedTypes} />
    {/if}
  {/snippet}
</DrilledMediaList>
