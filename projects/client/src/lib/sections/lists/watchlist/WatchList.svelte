<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useWatchList } from "./useWatchList";
  import WatchlistItem from "./WatchlistItem.svelte";

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
  urlBuilder={() => UrlBuilder.lists.watchlist("me")}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
