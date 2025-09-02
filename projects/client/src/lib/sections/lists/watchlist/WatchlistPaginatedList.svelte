<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TypeToggles from "./_internal/TypeToggles.svelte";
  import WatchlistTag from "./_internal/WatchlistTag.svelte";
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

  type ToggleType = MediaType | "all";

  const selectedType = writable<ToggleType>(type ? type : "all");

  const handleTypeChange = (value: ToggleType) => selectedType.set(value);

  onMount(() => {
    if (!onTypeChange) {
      return;
    }

    const unsubscribe = selectedType.subscribe((value) => {
      if (value === "all") {
        onTypeChange(["movie", "show"]);
        return;
      }

      onTypeChange([value]);
    });

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
      <TypeToggles value={$selectedType} onChange={handleTypeChange} />
    {/if}

    {#if status === "unreleased" || status === "released"}
      <WatchlistTag {status} />
    {/if}
  {/snippet}
</DrilledMediaList>
