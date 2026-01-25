<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import type { SortBy } from "../models/SortBy";

  const { sortBy }: { sortBy: SortBy } = $props();
</script>

{#if sortBy === "percentage"}
  <RatingIcon />
{/if}

{#if sortBy === "runtime"}
  <ClockIcon />
{/if}

{#if sortBy === "released" || sortBy === "added"}
  <CalendarIcon />
{/if}
