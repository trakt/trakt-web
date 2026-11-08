<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import RecommendedModeToggles from "$lib/features/recommendations/RecommendedModeToggles.svelte";
  import { useRecommendedMode } from "$lib/features/recommendations/useRecommendedMode";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useAnticipatedRecommendedList } from "./useAnticipatedRecommendedList";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendationListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
  };

  const {
    title,
    drilldownLabel,
    type,
  }: RecommendationListProps = $props();
  const { filterMap } = useFilter();
  const { isAnticipated } = useRecommendedMode();

  const cta = $derived({
    type: "recommended" as const,
    mediaType: type === "media" ? undefined : type,
  });
</script>

{#snippet actions()}
  <RecommendedModeToggles />
{/snippet}

{#if $isAnticipated}
  <DrillableMediaList
    --height-override-card="var(--height-portrait-card-sm)"
    --height-override-list="var(--height-poster-list-sm)"
    id={{
      scope: "anticipated-recommended-list",
      key: type,
    }}
    source={{ id: "recommended", type }}
    {title}
    {drilldownLabel}
    {type}
    filter={{
      ...$filterMap,
      ...extractWatchWindowParam(page.url.searchParams),
    }}
    {actions}
    useList={(params) => useAnticipatedRecommendedList(params)}
    urlBuilder={() => UrlBuilder.recommended()}
  >
    {#snippet item(media)}
      <DefaultMediaItem
        type={media.type}
        {media}
        mode={type === "media" ? "mixed" : "standalone"}
        source="recommended"
        canDeemphasize
      />
    {/snippet}
  </DrillableMediaList>
{:else}
  <DrillableMediaList
    --height-override-card="var(--height-portrait-card-sm)"
    --height-override-list="var(--height-poster-list-sm)"
    id={{
      scope: "recommended-list",
      key: type,
    }}
    source={{ id: "recommended", type }}
    {title}
    {drilldownLabel}
    {type}
    filter={{
      ...$filterMap,
      ...extractWatchWindowParam(page.url.searchParams),
    }}
    {actions}
    useList={(params) => useRecommendedList(params)}
    urlBuilder={() => UrlBuilder.recommended()}
  >
    {#snippet item(media)}
      <RecommendedListItem
        type={media.type}
        {media}
        mode={type === "media" ? "mixed" : "standalone"}
      />
    {/snippet}

    {#snippet ctaItem()}
      <CtaItem {cta} variant="card" />
    {/snippet}

    {#snippet empty()}
      <CtaItem {cta} variant="placeholder" />
    {/snippet}
  </DrillableMediaList>
{/if}
