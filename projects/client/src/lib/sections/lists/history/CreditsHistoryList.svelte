<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import CreditMediaItem from "../components/CreditMediaItem.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import NoFilterResultsPlaceholder from "../drilldown/_internal/NoFilterResultsPlaceholder.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useHistoryCreditsList } from "./_internal/useHistoryCreditsList";

  const {
    person,
    drilldownLink,
  }: { person: PersonSummary; drilldownLink?: string } = $props();

  const { filterMap, hasActiveFilter } = useFilter();

  const { list, isLoading } = useHistoryCreditsList({
    slug$: fromRune(() => person.slug),
    filter$: filterMap,
  });
</script>

<SectionList
  id={{
    scope: "credits-history-list",
    key: person.slug,
  }}
  items={$list}
  title={m.list_title_from_my_history()}
  drilldown={drilldownLink
    ? {
        href: drilldownLink,
        label: m.button_text_view_all(),
        source: { id: "credits-history" },
      }
    : undefined}
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
    {#if $isLoading}
      <SkeletonList id="credits-history-list" variant="portrait" />
    {:else if $hasActiveFilter}
      <NoFilterResultsPlaceholder />
    {:else}
      <p class="secondary">
        {m.list_placeholder_from_my_history({ name: person.name })}
      </p>
    {/if}
  {/snippet}
</SectionList>
