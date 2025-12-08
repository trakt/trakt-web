<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import CreditMediaItem from "../components/CreditMediaItem.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import { useHistoryCreditsList } from "./_internal/useHistoryCreditsList";

  const { person }: { person: PersonSummary } = $props();

  const { list, isLoading } = $derived(
    useHistoryCreditsList({ slug: person.slug }),
  );
</script>

<SectionList
  id={`credits-history-list-${person.slug}`}
  items={$list}
  title={m.list_title_from_my_history()}
  --height-list={mediaListHeightResolver("portrait")}
>
  {#snippet item(entry)}
    <CreditMediaItem
      mediaCredit={entry}
      source="credits-history"
      mode="mixed"
    />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="secondary">
        {m.list_placeholder_from_my_history({ name: person.name })}
      </p>
    {/if}
  {/snippet}
</SectionList>
