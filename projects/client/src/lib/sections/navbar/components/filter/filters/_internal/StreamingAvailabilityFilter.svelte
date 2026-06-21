<script lang="ts">
  import {
    type Filter,
    FilterKey,
    type ListFilter as ListFilterModel,
  } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import ListFilter from "../ListFilter.svelte";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions";

  const { filters } = useFilter();

  const isStreamingFilter = (filter: Filter): filter is ListFilterModel =>
    filter.key === FilterKey.Streaming && filter.type === "list";

  const baseFilter = $derived(filters.find(isStreamingFilter));

  const options = useStreamingServiceOptions();

  const augmentedFilter = $derived(
    baseFilter
      ? {
        ...baseFilter,
        options: [
          ...baseFilter.options,
          ...$options.top.map((brand) => ({
            label: () => brand.name,
            value: brand.slugs.join(","),
          })),
        ],
      }
      : undefined,
  );
</script>

{#if augmentedFilter}
  <ListFilter filter={augmentedFilter} />
{/if}
