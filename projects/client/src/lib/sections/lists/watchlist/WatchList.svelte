<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import WatchListItem from "./_internal/WatchListItem.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    type?: DiscoverMode;
    drilldownLabel: string;
    empty?: Snippet;
    intent?: "default" | "start";
  };

  const { type, drilldownLabel, intent = "default" }: WatchListProps = $props();
  const { filterMap } = useFilter();

  const source = $derived(
    intent === "default" ? "watchlist" : "start-watching",
  );

  const cta = $derived({
    type:
      intent === "default"
        ? ("watchlist" as const)
        : ("start-watching" as const),
    mediaType: type === "media" ? undefined : type,
  });

  const cardHeight = $derived(
    intent === "default"
      ? "var(--height-portrait-card-sm)"
      : "var(--height-portrait-card)",
  );
  const listHeight = $derived(
    intent === "default"
      ? "var(--height-poster-list-sm)"
      : "var(--height-poster-list)",
  );
</script>

<DrillableMediaList
  --height-override-card={cardHeight}
  --height-override-list={listHeight}
  id={`watch-list-${type ?? "media"}-${intent}`}
  source={{ id: source, type }}
  title={intent === "default"
    ? m.list_title_watchlist()
    : m.list_title_start_watching()}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={(params) => useWatchList({ intent, ...params })}
  urlBuilder={() => getListUrl({ type: "watchlist", intent })}
>
  {#snippet item(item)}
    <WatchListItem type={item.type} media={item.entry} mode={type} {intent} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
