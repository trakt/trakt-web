<script lang="ts">
  import { page } from "$app/state";
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import type { AdditionalKey } from "$lib/features/filters/models/FilterOptions.ts";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { parentalGuideFilters } from "$lib/features/filters/parentalGuideFilters.ts";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import { isAutoRenderedFilter } from "./_internal/isAutoRenderedFilter";
  import { isMultiSelectFilter } from "./_internal/isMultiSelectFilter";
  import { isSliderFilter } from "./_internal/isSliderFilter";
  import FilterGroup from "./FilterGroup.svelte";
  import MultiSelectFilter from "./_internal/MultiSelectFilter.svelte";
  import StreamingAvailabilityFilter from "./_internal/StreamingAvailabilityFilter.svelte";
  import StreamingServicesFilter from "./_internal/StreamingServicesFilter.svelte";
  import ListFilter from "./ListFilter.svelte";
  import SliderFilter from "./SliderFilter.svelte";
  import ToggleFilter from "./ToggleFilter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const { filters } = useFilter();
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const REVEAL_DURATION = 320;
  const REVEAL_BLUR = 4;

  const reveal = (node: HTMLElement) => {
    const duration = $isReducedMotion ? 0 : REVEAL_DURATION;
    const height = slide(node, { duration, easing: cubicOut });

    return {
      duration,
      easing: cubicOut,
      css: (t: number, u: number) =>
        `${height.css?.(t, u) ?? ""}; opacity: ${t}; filter: blur(${
          u * REVEAL_BLUR
        }px);`,
    };
  };
  const { activeMode } = useStoredFilters();

  const isSet = (
    { key, additionalKeys = [] }: {
      key: FilterKey;
      additionalKeys?: ReadonlyArray<AdditionalKey>;
    },
  ) =>
    [key, ...additionalKeys.map((additional) => additional.key)]
      .some((candidate) => page.url.searchParams.get(candidate) != null);

  const isAdvanced = $derived($activeMode === FilterMode.Advanced);

  const simpleLists = $derived(
    filters
      .filter(isAutoRenderedFilter)
      .filter((filter) => filter.type === "list")
      .filter(isSet),
  );
  const simpleSliders = $derived(
    filters
      .filter(isAutoRenderedFilter)
      .filter((filter) => filter.type === "slider")
      .filter(isSet),
  );

  const advancedMultiSelects = $derived(
    filters.filter(isMultiSelectFilter).filter(isSet),
  );
  const advancedSliders = $derived(
    filters
      .filter(isAutoRenderedFilter)
      .filter(isSliderFilter)
      .filter((filter) =>
        isSet({
          key: filter.key,
          additionalKeys: filter.advanced.additionalKeys,
        })
      ),
  );
  const parentalGuides = $derived(parentalGuideFilters.filter(isSet));

  const toggles = $derived(
    filters.filter((filter) => filter.type === "toggle").filter(isSet),
  );

  const hasAny = $derived(
    toggles.length > 0 ||
      (isAdvanced
        ? advancedMultiSelects.length + advancedSliders.length +
            parentalGuides.length > 0
        : simpleLists.length + simpleSliders.length > 0),
  );
</script>

{#if hasAny}
  <div class="trakt-active-filters" transition:reveal|global>
    {#if isAdvanced}
      {#if advancedMultiSelects.length > 0}
        <div class="active-filter" transition:reveal>
        <FilterGroup>
          {#each advancedMultiSelects as filter (filter.key)}
            <div class="active-filter-cell" transition:reveal>
              {#if filter.key === FilterKey.Streaming}
                <StreamingServicesFilter {filter} />
              {:else}
                <MultiSelectFilter {filter} />
              {/if}
            </div>
          {/each}
        </FilterGroup>
        </div>
      {/if}

      {#each advancedSliders as filter (filter.key)}
        <div class="active-filter" transition:reveal>
          <SliderFilter
            key={filter.key}
            sliderOptions={filter.advanced}
            mode={FilterMode.Advanced}
            additionalKeys={filter.advanced.additionalKeys}
          />
        </div>
      {/each}

      {#each parentalGuides as filter (filter.key)}
        <div class="active-filter" transition:reveal>
          <SliderFilter
            key={filter.key}
            sliderOptions={filter.advanced}
            mode={FilterMode.Advanced}
          />
        </div>
      {/each}
    {:else}
      {#if simpleLists.length > 0}
        <div class="active-filter" transition:reveal>
        <FilterGroup>
          {#each simpleLists as filter (filter.key)}
            <div class="active-filter-cell" transition:reveal>
              {#if filter.key === FilterKey.Streaming}
                <StreamingAvailabilityFilter {filter} />
              {:else}
                <ListFilter {filter} />
              {/if}
            </div>
          {/each}
        </FilterGroup>
        </div>
      {/if}

      {#each simpleSliders as filter (filter.key)}
        <div class="active-filter" transition:reveal>
          <SliderFilter
            key={filter.key}
            sliderOptions={filter}
            mode={FilterMode.Simple}
          />
        </div>
      {/each}
    {/if}

    {#each toggles as filter (filter.key)}
      <div class="active-filter" transition:reveal>
        <ToggleFilter {filter} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .trakt-active-filters {
    display: flex;
    flex-direction: column;
  }

  .active-filter {
    padding-bottom: var(--gap-m);
  }

  .active-filter-cell {
    min-width: 0;
  }
</style>
