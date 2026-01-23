<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    type?: DiscoverMode;
    drilldownLabel: string;
    empty?: Snippet;
  };

  const { type, drilldownLabel }: WatchListProps = $props();
  const { filterMap } = useFilter();

  const cta = $derived({
    type: "watchlist" as const,
    mediaType: type === "media" ? undefined : type,
  });
</script>

<DrillableMediaList
  id={`watch-list-${type ?? "media"}`}
  source={{ id: "watchlist", type }}
  title={m.list_title_watchlist()}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={useWatchList}
  urlBuilder={() => getListUrl({ type: "watchlist" })}
>
  {#snippet item(item)}
    <DefaultMediaItem
      type={item.type}
      media={item.entry}
      mode={type === "media" ? "mixed" : "standalone"}
      source="watchlist"
    />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
