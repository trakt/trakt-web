<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ReorderIcon from "$lib/components/icons/ReorderIcon.svelte";
  import RemainingIcon from "$lib/components/icons/RemainingIcon.svelte";
  import SortAlphaIcon from "$lib/components/icons/SortAlphaIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import type { UserListsSortBy } from "$lib/requests/models/UserListsSortBy.ts";
  import type { UpNextSortBy } from "$lib/sections/lists/progress/UpNextSortBy.ts";
  import type { SortBy } from "./models/SortBy.ts";

  const {
    sortBy,
    variant = "default",
  }: {
    sortBy: SortBy | UpNextSortBy | UserListsSortBy;
    variant?: "default" | "value";
  } =
    $props();
</script>

{#if sortBy === "percentage" && variant === "default"}
  <StarIcon fill="full" />
{:else if sortBy === "percentage"}
  <RatingIcon />
{/if}

{#if sortBy === "my_rating"}
  <StarIcon fill="full" />
{/if}

{#if sortBy === "runtime"}
  <ClockIcon />
{/if}

{#if sortBy === "released" || sortBy === "added"}
  <CalendarIcon />
{/if}

{#if sortBy === "updated_at" || sortBy === "created_at"}
  <CalendarIcon />
{/if}

{#if sortBy === "title" || sortBy === "name"}
  <SortAlphaIcon />
{/if}

{#if sortBy === "remaining"}
  <RemainingIcon />
{/if}

{#if sortBy === "rank"}
  <ReorderIcon />
{/if}
