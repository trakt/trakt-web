<script lang="ts">
  import { page } from "$app/state";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import CreditMediaItem from "./components/CreditMediaItem.svelte";
  import NoFilterResultsPlaceholder from "./drilldown/_internal/NoFilterResultsPlaceholder.svelte";
  import { useCreditsList } from "./stores/useCreditsList";
  import { parseRequestedPosition } from "./utils/parseRequestedPosition";
  import { resolveSelectedPosition } from "./utils/resolveSelectedPosition";

  type CreditsPaginatedListProps = {
    slug: string;
    type: MediaType;
  };

  const { slug, type }: CreditsPaginatedListProps = $props();

  const { filterMap, hasActiveFilter } = useFilter();
  const { mode } = useDiscover();

  const { credits, isLoading } = useCreditsList({
    type$: fromRune(() => type),
    slug$: fromRune(() => slug),
    filter$: filterMap,
    mode$: mode,
  });

  const requestedPosition = $derived(parseRequestedPosition(page.url, type));
  const selectedPosition = $derived(
    resolveSelectedPosition({ requested: requestedPosition, credits: $credits }),
  );

  const list = $derived($credits?.get(selectedPosition) ?? []);
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
