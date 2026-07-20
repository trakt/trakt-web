<script lang="ts">
  import { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import StreamingAvailabilityFilter from "./_internal/StreamingAvailabilityFilter.svelte";
  import ListFilter from "./ListFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const { filters } = useFilter();
  const { isEnabled } = useFeatureFlag();
  const isStreamingServicesEnabled = $derived(
    isEnabled(FeatureFlag.StreamingServices),
  );

  const listTypeFilters = $derived(
    filters.filter((filter) => filter.type === "list"),
  );
  const ratingTypeFilters = $derived(
    filters.filter((filter) => filter.type === "slider"),
  );
</script>

<FilterGroup>
  {#each listTypeFilters as filter (filter.key)}
    {#if filter.key === FilterKey.Streaming && $isStreamingServicesEnabled}
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
