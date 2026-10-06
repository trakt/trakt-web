<script lang="ts">
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { parentalGuideFilters } from "$lib/features/filters/parentalGuideFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterSection from "../FilterSection.svelte";
  import FilterChips from "./_internal/FilterChips.svelte";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import { isAutoRenderedFilter } from "./_internal/isAutoRenderedFilter";
  import { isMultiSelectFilter } from "./_internal/isMultiSelectFilter";
  import { isSliderFilter } from "./_internal/isSliderFilter";
  import MultiSelectFilter from "./_internal/MultiSelectFilter.svelte";
  import StreamingServicesFilter from "./_internal/StreamingServicesFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";

  const { filters } = useFilter();

  const sliderFilters = $derived(
    filters.filter(isAutoRenderedFilter).filter(isSliderFilter),
  );
  const multiSelectFilters = $derived(filters.filter(isMultiSelectFilter));
</script>

<div class="trakt-advanced-filters">
  <FilterGroup>
    <FilterChips>
      {#each multiSelectFilters as filter (filter.key)}
        {#if filter.key === FilterKey.Streaming}
          <StreamingServicesFilter {filter} />
        {:else}
          <MultiSelectFilter {filter} />
        {/if}
      {/each}
    </FilterChips>

    {#each sliderFilters as filter (filter.key)}
      <SliderFilter
        key={filter.key}
        sliderOptions={filter.advanced}
        mode={FilterMode.Advanced}
        additionalKeys={filter.advanced.additionalKeys}
      />
    {/each}
  </FilterGroup>

  <FilterSection title={m.option_text_certification_parental_guidance()}>
    <FilterGroup>
      {#each parentalGuideFilters as filter (filter.key)}
        <SliderFilter
          key={filter.key}
          sliderOptions={filter.advanced}
          mode={FilterMode.Advanced}
        />
      {/each}
    </FilterGroup>
  </FilterSection>
</div>

<style>
  .trakt-advanced-filters {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

</style>
