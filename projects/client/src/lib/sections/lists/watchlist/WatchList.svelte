<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import { writable } from "svelte/store";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import TypeToggles from "./_internal/TypeToggles.svelte";
  import WatchlistTag from "./_internal/WatchlistTag.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
  import { statusToStore } from "./statusToStore";
  import WatchlistItem from "./WatchlistItem.svelte";

  type WatchListProps = {
    defaultType?: MediaType;
    drilldownLabel: string;
    empty?: Snippet;
    status: "all" | "released" | "unreleased";
  };

  type ToggleType = MediaType | "all";

  const { defaultType, status, drilldownLabel }: WatchListProps = $props();
  const { filterMap } = useFilter();

  const useList = $derived.by(() => statusToStore(status));

  const selectedType = writable<ToggleType>(defaultType ? defaultType : "all");

  const handleTypeChange = (value: ToggleType) => {
    selectedType.set(value);
  };

  const type = $derived($selectedType === "all" ? undefined : $selectedType);
</script>

<DrillableMediaList
  id="watch-list-{type}-{status}"
  title={m.list_title_watchlist()}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {useList}
  urlBuilder={({ type, ...rest }) => {
    if (status === "all") {
      return UrlBuilder.lists.watchlist({
        ...rest,
        display: type,
      });
    }

    return UrlBuilder.lists.user({
      type: assertDefined(type),
      ...rest,
      status,
    });
  }}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} />
  {/snippet}

  {#snippet ctaItem()}
    {#if status !== "all"}
      <CtaItem cta={status} variant="card" />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if status !== "all"}
      <CtaItem cta={status} variant="placeholder" />
    {/if}

    {#if status === "all"}
      <EmptyWatchlist {type} {status} />
    {/if}
  {/snippet}

  {#snippet badge()}
    {#if status === "all"}
      <TypeToggles value={$selectedType} onChange={handleTypeChange} />
    {/if}

    {#if status === "unreleased" || status === "released"}
      <WatchlistTag {status} />
    {/if}
  {/snippet}
</DrillableMediaList>
