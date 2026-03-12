<script lang="ts">
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import ListFilter from "./ListFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const { filters } = useFilter();

  const listTypeFilters = $derived(
    filters.filter((filter) => filter.type === "list"),
  );
  const ratingTypeFilters = $derived(
    filters.filter((filter) => filter.type === "slider"),
  );
</script>

<FilterGroup>
  {#each listTypeFilters as filter (filter.key)}
    <ListFilter {filter} />
  {/each}
</FilterGroup>

{#each ratingTypeFilters as filter (filter.key)}
  <SliderFilter
    key={filter.key}
    sliderOptions={filter}
    mode={FilterMode.Simple}
  />
{/each}
