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
  import AdvancedFilters from "./filters/AdvancedFilters.svelte";
  import { useFilterSetter } from "./filters/_internal/useFilterSetter";
  import SimpleFilters from "./filters/SimpleFilters.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const {
    activeMode,
    setActiveMode,
    actions,
  }: {
    activeMode: FilterMode;
    setActiveMode: (to: string) => void;
    actions?: Snippet;
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
    {onChange}
    --segmented-select-radius="var(--border-radius-l)"
  />
{/snippet}

<div class="trakt-filter-tabs">
  {@render actions?.()}

  <FilterSection title={m.header_filters()} control={modeSelector}>
    {#if activeMode === FilterMode.Simple}
      <SimpleFilters />
    {:else}
      <AdvancedFilters />
    {/if}
  </FilterSection>

  <FilterSection title={m.header_display()}>
    <div class="display-toggles">
      {#each toggleTypeFilters as filter (filter.key)}
        <ToggleFilter {filter} />
      {/each}
    </div>
  </FilterSection>
</div>

<style>
  .trakt-filter-tabs {
    display: flex;
    flex-direction: column;
    gap: var(--filters-content-gap, var(--gap-l));
  }

  .display-toggles {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
