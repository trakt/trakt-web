<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useFilter } from "$lib/features/filters/useFilter";
  import CreditMediaItem from "../components/CreditMediaItem.svelte";
  import NoFilterResultsPlaceholder from "../drilldown/_internal/NoFilterResultsPlaceholder.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useHistoryCreditsList } from "./_internal/useHistoryCreditsList";

  type CreditsHistoryPaginatedListProps = {
    slug: string;
    name: string;
  };

  const { slug, name }: CreditsHistoryPaginatedListProps = $props();

  const { filterMap, hasActiveFilter } = useFilter();

  const { list, isLoading } = useHistoryCreditsList({
    slug$: fromRune(() => slug),
    filter$: filterMap,
  });
</script>

<GridList
  id={`credits-history-list-${slug}`}
  items={$list}
  sizing="auto"
  --width-item="var(--width-summary-card)"
>
  {#snippet item(entry)}
    <CreditMediaItem
      mediaCredit={entry}
      source="credits-history"
      mode="mixed"
      style="summary"
    />
  {/snippet}

  {#snippet empty()}
    {#if $hasActiveFilter && !$isLoading}
      <NoFilterResultsPlaceholder />
    {:else if $isLoading}
      <LoadingIndicator />
    {:else}
      <p class="secondary">
        {m.list_placeholder_from_my_history({ name })}
      </p>
    {/if}
  {/snippet}
</GridList>
