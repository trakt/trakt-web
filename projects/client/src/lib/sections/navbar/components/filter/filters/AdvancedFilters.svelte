<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { parentalGuideFilters } from "$lib/features/filters/parentalGuideFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFilter } from "$lib/features/filters/useFilter";
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

<RenderForFeature flag={FeatureFlag.ParentalGuide}>
  {#snippet enabled()}
    <p class="bold">{m.option_text_certification_parental_guidance()}</p>
    {#each parentalGuideFilters as filter (filter.key)}
      <SliderFilter
        key={filter.key}
        sliderOptions={filter.advanced}
        mode={FilterMode.Advanced}
      />
    {/each}
  {/snippet}
</RenderForFeature>
