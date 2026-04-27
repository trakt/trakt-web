<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import RemainingIcon from "$lib/components/icons/RemainingIcon.svelte";
  import SortAlphaIcon from "$lib/components/icons/SortAlphaIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import type { UpNextSortBy } from "$lib/sections/lists/progress/UpNextSortBy";
  import type { SortBy } from "../models/SortBy";

  const {
    sortBy,
    variant = "default",
  }: { sortBy: SortBy | UpNextSortBy; variant?: "default" | "value" } =
    $props();
</script>

{#if sortBy === "percentage" && variant === "default"}
  <StarIcon fill="full" />
{:else if sortBy === "percentage"}
  <RatingIcon />
{/if}

{#if sortBy === "runtime"}
  <ClockIcon />
{/if}

{#if sortBy === "released" || sortBy === "added"}
  <CalendarIcon />
{/if}

{#if sortBy === "title"}
  <SortAlphaIcon />
{/if}

{#if sortBy === "remaining"}
  <RemainingIcon />
{/if}
