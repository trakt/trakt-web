<script lang="ts">
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import { isMultiSelectFilter } from "./_internal/isMultiSelectFilter";
  import { isSliderFilter } from "./_internal/isSliderFilter";
  import MultiSelectFilter from "./_internal/MultiSelectFilter.svelte";
  import StreamingServicesFilter from "./_internal/StreamingServicesFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const { filters } = useFilter();

  const sliderFilters = $derived(filters.filter(isSliderFilter));
  const multiSelectFilters = $derived(filters.filter(isMultiSelectFilter));
</script>

<FilterGroup>
  {#each multiSelectFilters as filter (filter.key)}
    {#if filter.key === FilterKey.Streaming}
      <StreamingServicesFilter {filter} />
    {:else}
      <MultiSelectFilter {filter} />
    {/if}
  {/each}
</FilterGroup>

{#each sliderFilters as filter (filter.key)}
  <SliderFilter
    key={filter.key}
    sliderOptions={filter.advanced}
    mode={FilterMode.Advanced}
    additionalKeys={filter.advanced.additionalKeys}
  />
{/each}
