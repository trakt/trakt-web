<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import WatchlistTag from "./_internal/WatchlistTag.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
  import { statusToStore } from "./statusToStore";
  import WatchlistItem from "./WatchlistItem.svelte";
  import type { WatchlistStatus } from "./WatchlistStatus";

  type WatchListProps = {
    title: string;
    type?: MediaType;
    status: WatchlistStatus;
  };

  const { title, type: externalType, status }: WatchListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
  const useList = $derived.by(() => statusToStore(status));
  const { filterMap } = useFilter();

  const { current: selectedType, set, options } = useToggler("media");

  const type = $derived.by(() => {
    if (externalType) {
      return externalType;
    }

    return $selectedType.value === "all" ? undefined : $selectedType.value;
  });
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  filter={$filterMap}
  {useList}
  metaInfo={$selectedType.text}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} {style} />
  {/snippet}

  {#snippet empty()}
    <EmptyWatchlist {type} {status} />
  {/snippet}

  {#snippet badge()}
    {#if status === "all"}
      <Toggler value={$selectedType.value} onChange={set} {options} />
    {/if}

    {#if status === "unreleased" || status === "released"}
      <WatchlistTag {status} />
    {/if}
  {/snippet}
</DrilledMediaList>
