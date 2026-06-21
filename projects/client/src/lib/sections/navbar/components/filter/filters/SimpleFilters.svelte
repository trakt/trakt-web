<script lang="ts">
  import { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import StreamingAvailabilityFilter from "./_internal/StreamingAvailabilityFilter.svelte";
  import ListFilter from "./ListFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const { filters } = useFilter();

  const listTypeFilters = $derived(
    filters.filter(
      (filter) =>
        filter.type === "list" && filter.key !== FilterKey.Streaming,
    ),
  );
  const ratingTypeFilters = $derived(
    filters.filter((filter) => filter.type === "slider"),
  );
</script>

<FilterGroup>
  {#each listTypeFilters as filter (filter.key)}
    <ListFilter {filter} />
  {/each}
  <StreamingAvailabilityFilter />
</FilterGroup>

{#each ratingTypeFilters as filter (filter.key)}
  <SliderFilter
    key={filter.key}
    sliderOptions={filter}
    mode={FilterMode.Simple}
  />
{/each}
