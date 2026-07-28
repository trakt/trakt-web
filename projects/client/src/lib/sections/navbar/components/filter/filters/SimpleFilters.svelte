<script lang="ts">
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useVisibleFilters } from "$lib/features/filters/useVisibleFilters";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import StreamingAvailabilityFilter from "./_internal/StreamingAvailabilityFilter.svelte";
  import ListFilter from "./ListFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const visibleFilters = useVisibleFilters();

  const listTypeFilters = $derived(
    $visibleFilters.filter((filter) => filter.type === "list"),
  );
  const ratingTypeFilters = $derived(
    $visibleFilters.filter((filter) => filter.type === "slider"),
  );
</script>

<FilterGroup>
  {#each listTypeFilters as filter (filter.key)}
    {#if filter.key === FilterKey.Streaming}
      <StreamingAvailabilityFilter {filter} />
    {:else}
      <ListFilter {filter} />
    {/if}
  {/each}
</FilterGroup>

{#each ratingTypeFilters as filter (filter.key)}
  <SliderFilter
    key={filter.key}
    sliderOptions={filter}
    mode={FilterMode.Simple}
  />
{/each}
