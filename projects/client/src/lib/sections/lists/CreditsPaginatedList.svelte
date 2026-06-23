<script lang="ts">
  import { page } from "$app/state";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import {
    crewPositionSchema,
    type CrewPosition,
  } from "$lib/requests/models/CrewPosition";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import CreditMediaItem from "./components/CreditMediaItem.svelte";
  import NoFilterResultsPlaceholder from "./drilldown/_internal/NoFilterResultsPlaceholder.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useCreditsList } from "./stores/useCreditsList";

  type CreditsPaginatedListProps = {
    slug: string;
    type: MediaType;
  };

  const { slug, type }: CreditsPaginatedListProps = $props();

  const { filterMap, hasActiveFilter } = useFilter();
  const { mode } = useDiscover();

  const selectedPosition = $derived<CrewPosition>(
    crewPositionSchema.safeParse(
      page.url.searchParams.get(`${type}s`)?.toLowerCase(),
    ).data ?? "acting",
  );

  const { credits, isLoading } = useCreditsList({
    type$: fromRune(() => type),
    slug$: fromRune(() => slug),
    filter$: filterMap,
    mode$: mode,
  });

  const getPositionList = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];
    return mediaCredits.get(selectedPosition) ?? [];
  };

  const list = $derived(getPositionList($credits));
  const hasMatchingType = $derived($mode === "media" || $mode === type);
</script>

<GridList
  id={`credits-list-${slug}-${type}-${selectedPosition}`}
  items={list}
  sizing="auto"
  --width-item="var(--width-summary-card)"
>
  {#snippet item(entry)}
    <CreditMediaItem
      mediaCredit={entry}
      source="credits"
      mode="standalone"
      style="summary"
    />
  {/snippet}

  {#snippet empty()}
    {#if ($hasActiveFilter || !hasMatchingType) && !$isLoading}
      <NoFilterResultsPlaceholder />
    {/if}
  {/snippet}
</GridList>
