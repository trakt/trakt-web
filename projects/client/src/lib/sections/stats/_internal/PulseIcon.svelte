<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";

  const { key }: { key: string } = $props();
</script>

{#if key === "totalPlays"}
  <PlayIcon />
{:else if key === "episodes"}
  <ShowIcon />
{:else if key === "movies"}
  <MovieIcon />
{:else if key === "shows"}
  <DiscoverIcon />
{:else if key === "activeDays"}
  <CalendarIcon />
{:else if key === "busiestDay"}
  <TrendIcon direction="up" />
{:else if key === "longestBinge"}
  <PlayIcon />
{:else if key === "hours"}
  <ClockIcon />
{:else if key === "ratings"}
  <StarIcon fill="full" />
{:else if key === "comments"}
  <CommentIcon style="filled" />
{/if}
