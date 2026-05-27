<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import FilterGroup from "./filters/_internal/FilterGroup.svelte";
  import { useFilterSetter } from "./filters/_internal/useFilterSetter";
  import AdvancedFilters from "./filters/AdvancedFilters.svelte";
  import SimpleFilters from "./filters/SimpleFilters.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const {
    activeMode,
    setActiveMode,
    actions,
    tabPosition,
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

{#snippet commonFilters()}
  <FilterGroup>
    {#each toggleTypeFilters as filter (filter.key)}
      <ToggleFilter {filter} />
    {/each}
  </FilterGroup>
{/snippet}

{#snippet simpleFilters()}
  <div class="trakt-filters-content">
    {@render actions?.()}
    <SimpleFilters />
    {@render commonFilters()}
  </div>
{/snippet}

{#snippet advancedFilters()}
  <div class="trakt-filters-content">
    {@render actions?.()}
    <AdvancedFilters />
    {@render commonFilters()}
  </div>
{/snippet}

<div class="trakt-filter-tabs">
  <TabView
    {tabPosition}
    value={activeMode}
    tabs={[
      {
        value: FilterMode.Simple,
        label: m.tab_text_simple_filters(),
        content: simpleFilters,
      },
      {
        value: FilterMode.Advanced,
        label: m.tab_text_advanced_filters(),
        content: advancedFilters,
      },
    ]}
    {onChange}
  />
</div>

<style lang="scss">
  .trakt-filters-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  /* Filters selector pill — restyles the shared TabView for the filter panel only. */
  .trakt-filter-tabs :global(.trakt-tab-view) {
    --tab-border-radius: var(--border-radius-m);
  }

  .trakt-filter-tabs :global(.trakt-tabs-list) {
    background-color: var(--shade-900);
    padding: var(--ni-4);
  }

  .trakt-filter-tabs :global(.trakt-tab-indicator) {
    background-color: var(--purple-700);
  }

  .trakt-filter-tabs :global(.trakt-tab-trigger) {
    height: var(--ni-32);
    color: var(--shade-10);
  }

  .trakt-filter-tabs :global(.trakt-tab-trigger[data-state="inactive"]) {
    opacity: 0.45;
  }

  .trakt-filter-tabs
    :global(.trakt-tab-trigger:hover:not([data-state="active"])) {
    background-color: color-mix(in srgb, var(--purple-700) 35%, transparent);
    opacity: 1;
  }

  .trakt-filter-tabs :global(.trakt-tab-trigger:focus-visible) {
    outline: var(--border-thickness-xxs) solid var(--purple-400);
    background-color: transparent;
    color: var(--shade-10);
  }

  .trakt-filter-tabs :global(.trakt-tab-trigger span) {
    text-transform: none;
    font-weight: 400;
  }

  .trakt-filter-tabs
    :global(.trakt-tab-trigger[data-state="active"] span) {
    font-weight: 600;
  }
</style>
