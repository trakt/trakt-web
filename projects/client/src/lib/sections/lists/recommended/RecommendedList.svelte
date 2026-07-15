<script lang="ts">
  import { page } from "$app/state";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { IS_DEV } from "$lib/utils/env";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import RecommendedUpsellCard from "./RecommendedUpsellCard.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  /** Free users get a taste of recommendations, then a VIP upsell as the
   * fourth slot. Capping to three keeps us at or below SectionList's cta
   * cut-off so the upsell renders as the trailing card. */
  const FREE_RECOMMENDATION_LIMIT = 3;

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
  const { user } = useUser();

  const { current, set, options } = useToggler("recommendation");
  const { isEnabled } = useFeatureFlag();
  const isSmartEnabled = isEnabled(FeatureFlag.SmartRecommendations);
  const isSmart = $derived($isSmartEnabled && $current.value === "smart");

  // Dev-only: preview the free-tier layout as any user (e.g. a VIP) via
  // `?preview-free`. Guarded by IS_DEV, so it is inert in production.
  const isPreviewingFree = $derived(
    IS_DEV && page.url.searchParams.has("preview-free"),
  );

  // Wait for the user to resolve before capping so a VIP never flashes the
  // upsell card. Unresolved -> treat as non-free (no cap).
  const isFreeUser = $derived(
    isPreviewingFree || ($user != null && !$user.isVip),
  );

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
  useList={(params) => {
    const store = useRecommendedList({ ...params, isSmart });
    if (!isFreeUser) return store;

    return {
      ...store,
      list: store.list.pipe(
        map((items) => items.slice(0, FREE_RECOMMENDATION_LIMIT)),
      ),
    };
  }}
  urlBuilder={() => UrlBuilder.recommended()}
>
  {#snippet actions()}
    <RenderForFeature flag={FeatureFlag.SmartRecommendations}>
      {#snippet enabled()}
        <Toggler
          value={$current.value}
          onChange={set}
          {options}
          variant="icon"
        />
      {/snippet}
    </RenderForFeature>
  {/snippet}

  {#snippet item(media)}
    <RecommendedListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}

  {#snippet ctaItem()}
    {#if isFreeUser}
      <RecommendedUpsellCard />
    {:else}
      <CtaItem {cta} variant="card" />
    {/if}
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
