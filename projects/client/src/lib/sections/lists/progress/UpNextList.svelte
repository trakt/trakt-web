<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { type DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import WatchlistItem from "../watchlist/WatchlistItem.svelte";
  import UpNextItem from "./UpNextItem.svelte";
  import { useHiddenShows } from "./useHiddenShows";
  import { useUpNextList } from "./useUpNextList";

  const { intent }: { intent: "continue" | "start" } = $props();

  const { list: hidden } = $derived(useHiddenShows());

  const { user } = useUser();
  const { mode } = useDiscover();
</script>

{#snippet content(
  type: DiscoverMode,
  upNextIntent: "all" | "continue" | "start",
)}
  <DrillableMediaList
    {type}
    id={`up-next-list-${type}-${upNextIntent}`}
    source={{
      id: upNextIntent === "start" ? "start-watching" : "continue-watching",
    }}
    drilldownLabel={"drill label"}
    useList={() =>
      useStablePaginated({
        type,
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        useList: (params) =>
          useUpNextList({
            ...params,
            intent: upNextIntent,
          }),
        compareFn: (l, r) => {
          const isComparingEpisodes = "show" in l && "show" in r;
          return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
        },
      })}
    urlBuilder={() =>
      upNextIntent === "start"
        ? UrlBuilder.startWatching($user?.slug ?? "")
        : UrlBuilder.progress($user?.slug ?? "")}
    title={upNextIntent === "start"
      ? m.list_title_start_watching()
      : m.list_title_up_next()}
    variant={intent === "start" ? "portrait" : "landscape"}
  >
    {#snippet item(mediaItem)}
      {#if upNextIntent === "start"}
        <WatchlistItem
          type={"show" in mediaItem ? "show" : "movie"}
          media={"show" in mediaItem ? mediaItem.show : mediaItem}
          mode={type === "media" ? "mixed" : "standalone"}
        />
      {:else if "show" in mediaItem}
        <UpNextItem
          style="cover"
          episode={mediaItem}
          show={mediaItem.show}
          status={$hidden.includes(mediaItem.show.id) ? "hidden" : "watching"}
        />
      {:else}
        <UpNextItem style="cover" movie={mediaItem} />
      {/if}
    {/snippet}

    {#snippet ctaItem()}
      <CtaItem
        cta={{
          type: intent === "start" ? "start-watching" : "up-next",
          mediaType: type === "media" ? undefined : type,
        }}
        variant="card"
      />
    {/snippet}

    {#snippet empty()}
      <CtaItem
        cta={{
          type: intent === "start" ? "start-watching" : "up-next",
          mediaType: type === "media" ? undefined : type,
        }}
        variant="placeholder"
      />
    {/snippet}
  </DrillableMediaList>
{/snippet}

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {@render content($mode, intent)}
  {/snippet}

  {@render content("show", "all")}
</RenderForFeature>
