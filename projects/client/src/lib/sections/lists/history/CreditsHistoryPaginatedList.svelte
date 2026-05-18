<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CreditMediaItem from "../components/CreditMediaItem.svelte";
  import { useHistoryCreditsList } from "./_internal/useHistoryCreditsList";

  type CreditsHistoryPaginatedListProps = {
    slug: string;
    name: string;
  };

  const { slug, name }: CreditsHistoryPaginatedListProps = $props();

  const { list, isLoading } = $derived(useHistoryCreditsList({ slug }));
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
    {#if $isLoading}
      <LoadingIndicator />
    {:else}
      <p class="secondary">
        {m.list_placeholder_from_my_history({ name })}
      </p>
    {/if}
  {/snippet}
</GridList>
