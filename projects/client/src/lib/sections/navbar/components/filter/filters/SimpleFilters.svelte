<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import FilterGroup from "./_internal/FilterGroup.svelte";
  import ListFilter from "./ListFilter.svelte";
  import RatingsFilter from "./RatingsFilter.svelte";

  const { filters } = useFilter();

  const listTypeFilters = $derived(
    filters.filter((filter) => filter.type === "list"),
  );
  const ratingTypeFilters = $derived(
    filters.filter((filter) => filter.type === "ratings"),
  );
</script>

<FilterGroup>
  {#each listTypeFilters as filter (filter.key)}
    <ListFilter {filter} />
  {/each}
</FilterGroup>

{#each ratingTypeFilters as filter (filter.key)}
  <RatingsFilter {filter} />
{/each}
