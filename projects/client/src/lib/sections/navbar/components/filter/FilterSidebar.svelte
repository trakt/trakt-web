<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FilterKey } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ResetAllButton from "./_internal/ResetAllButton.svelte";
  import SaveFiltersButton from "./_internal/SaveFiltersButton.svelte";
  import FilterGroup from "./filters/_internal/FilterGroup.svelte";
  import { useFilterSetter } from "./filters/_internal/useFilterSetter";
  import ListFilter from "./filters/ListFilter.svelte";
  import RatingsFilter from "./filters/RatingsFilter.svelte";
  import SliderFilter from "./filters/SliderFilter.svelte";
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

  const genreAndAStreamingFilters = $derived(
    filters.filter(
      (filter) =>
        filter.key === FilterKey.Genres || filter.key === FilterKey.Streaming,
    ),
  );

  let activeTab = $state<"simple" | "advanced">("simple");

  // TODO not like this
  const { gotoFilteredState } = useFilterSetter();
  const handler = (key: FilterKey, value?: { min: number; max: number }) => {
    gotoFilteredState({
      key,
      value: value ? `${value.min}-${value.max}` : null,
    });
  };

  // TODO: map values between simple & advanced?
</script>

<Drawer
  {onClose}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <div class="trakt-filter-tabs">
    <h2
      class:bold={activeTab === "simple"}
      class:secondary={activeTab !== "simple"}
      class:active={activeTab === "simple"}
      onclick={() => (activeTab = "simple")}
    >
      Simple
    </h2>
    <h2
      class:bold={activeTab === "advanced"}
      class:secondary={activeTab !== "advanced"}
      class:active={activeTab === "advanced"}
      onclick={() => (activeTab = "advanced")}
    >
      Advanced
    </h2>
  </div>

  {#if activeTab === "simple"}
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
  {/if}

  {#if activeTab === "advanced"}
    <!-- TODO define in a similar way to simple filters -->
    <div class="trakt-filters-content">
      <FilterGroup>
        {#each genreAndAStreamingFilters as filter}
          <ListFilter {filter} multiselect />
        {/each}
      </FilterGroup>

      <SliderFilter
        range={{ min: 0, max: 500 }}
        defaultValue={{ min: 0, max: 500 }}
        formatLabel={({ min, max }) => `Runtime of ${min} to ${max} minutes`}
        onChange={(value) => handler(FilterKey.Runtime, value)}
      />
      <SliderFilter
        range={{ min: 1930, max: new Date().getFullYear() + 10 }}
        defaultValue={{ min: 1930, max: new Date().getFullYear() + 10 }}
        formatLabel={({ min, max }) => `Released in ${min} to ${max}`}
        onChange={(value) => handler(FilterKey.Decade, value)}
      />
      <SliderFilter
        range={{ min: 0, max: 5 }}
        defaultValue={{ min: 0, max: 5 }}
        step={0.5}
        tickLabelsCount={6}
        formatLabel={({ min, max }) => `Trakt rating ${min} to ${max}`}
        onChange={(value) => handler(FilterKey.Ratings, value)}
      />
      <FilterGroup>
        {#each toggleTypeFilters as filter}
          <ToggleFilter {filter} />
        {/each}
      </FilterGroup>
    </div>
  {/if}
</Drawer>

<style>
  .trakt-filter-tabs {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-s);

    h2 {
      cursor: pointer;

      transition: color var(--transition-increment) ease-in-out;

      &.active {
        text-decoration: underline;
      }
    }
  }

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
