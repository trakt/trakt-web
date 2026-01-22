<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ResetAllButton from "./_internal/ResetAllButton.svelte";
  import SaveFiltersButton from "./_internal/SaveFiltersButton.svelte";
  import FilterGroup from "./filters/_internal/FilterGroup.svelte";
  import ListFilter from "./filters/ListFilter.svelte";
  import RatingsFilter from "./filters/RatingsFilter.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const { onClose }: { onClose: () => void } = $props();
  const { filters } = useFilter();

  const listTypeFilters = $derived(
    filters.filter((filter) => filter.type === "list"),
  );
  const ratingTypeFilters = $derived(
    filters.filter((filter) => filter.type === "ratings"),
  );
  const toggleTypeFilters = $derived(
    filters.filter((filter) => filter.type === "toggle"),
  );
</script>

<Drawer
  {onClose}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <div class="trakt-filters-content">
    <FilterGroup>
      {#each listTypeFilters as filter}
        <ListFilter {filter} />
      {/each}
    </FilterGroup>

    {#each ratingTypeFilters as filter}
      <RatingsFilter {filter} />
    {/each}

    <FilterGroup>
      {#each toggleTypeFilters as filter}
        <ToggleFilter {filter} />
      {/each}
    </FilterGroup>

    <div
      class="trakt-filter-actions"
      data-dpad-navigation={DpadNavigationType.List}
    >
      <ResetAllButton />
      <SaveFiltersButton onSave={onClose} />
    </div>
  </div>
</Drawer>

<style>
  .trakt-filter-actions {
    display: flex;
    gap: var(--gap-xs);

    :global(.trakt-button) {
      flex: 1;
    }
  }

  .trakt-filters-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
