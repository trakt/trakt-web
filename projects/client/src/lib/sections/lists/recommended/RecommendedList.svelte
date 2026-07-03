<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendationListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
    filterOverride?: FilterOverrideParams;
  };

  const {
    title,
    drilldownLabel,
    type,
    filterOverride,
  }: RecommendationListProps = $props();
  const { filterMap } = useFilter();

  const cta = $derived({
    type: "recommended" as const,
    mediaType: type === "media" ? undefined : type,
  });
</script>

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
  {filterOverride}
  useList={useRecommendedList}
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
