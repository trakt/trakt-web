<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import FilterSection from "./FilterSection.svelte";
  import FilterGroup from "./filters/_internal/FilterGroup.svelte";
  import AdvancedFilters from "./filters/AdvancedFilters.svelte";
  import { useFilterSetter } from "./filters/_internal/useFilterSetter";
  import SimpleFilters from "./filters/SimpleFilters.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const {
    activeMode,
    setActiveMode,
    actions,
    tabPosition = "top",
  }: {
    activeMode: FilterMode;
    setActiveMode: (to: string) => void;
    actions?: Snippet;
    tabPosition?: "top" | "bottom";
  } = $props();

  const { filters, hasAnyAdvancedFilter, filterMap } = useFilter();

  const toggleTypeFilters = $derived(
    filters.filter((filter) => filter.type === "toggle"),
  );

  const { confirm } = useConfirm();
  const { syncAdditionalKeys } = useFilterSetter();

  const modeOptions = [
    { value: FilterMode.Simple, text: m.tab_text_simple_filters() },
    { value: FilterMode.Advanced, text: m.tab_text_advanced_filters() },
  ];

  const onChange = (to: string) => {
    if (to === activeMode) {
      return;
    }

    const from = activeMode;
    setActiveMode(to);

    if (to === FilterMode.Advanced) {
      syncAdditionalKeys($filterMap);
      return;
    }

    if (to !== FilterMode.Simple || !$hasAnyAdvancedFilter) {
      return;
    }

    confirm({
      type: ConfirmationType.SimpleFilters,
      onConfirm: () => {
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(page.url.pathname, { replaceState: true });
      },
      onCancel: () => setActiveMode(from),
    })();
  };
</script>

{#snippet modeSelector()}
  <SegmentedSelect
    options={modeOptions}
    value={activeMode}
    ariaLabel={m.header_filters()}
    fill
    {onChange}
    --segmented-select-radius="var(--border-radius-m)"
  />
{/snippet}

<div class="trakt-filter-tabs">
  {@render actions?.()}

  <div class="filter-modes">
    {#if tabPosition === "top"}
      {@render modeSelector()}
    {/if}

    {#if activeMode === FilterMode.Simple}
      <SimpleFilters />
    {:else}
      <AdvancedFilters />
    {/if}
  </div>

  <FilterSection title={m.header_display()}>
    <FilterGroup>
      {#each toggleTypeFilters as filter (filter.key)}
        <ToggleFilter {filter} />
      {/each}
    </FilterGroup>
  </FilterSection>

  {#if tabPosition === "bottom"}
    {@render modeSelector()}
  {/if}
</div>

<style>
  .trakt-filter-tabs {
    display: flex;
    flex-direction: column;
    gap: var(--filters-content-gap, var(--gap-l));
  }

  .filter-modes {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
