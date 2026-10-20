<script lang="ts">
  import BoltIcon from "$lib/components/icons/BoltIcon.svelte";
  import ChainIcon from "$lib/components/icons/ChainIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MoonIcon from "$lib/components/icons/MoonIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import type { VipAchievementId } from "../models/VipAchievementId.ts";

  const { id }: { id: VipAchievementId } = $props();
</script>

{#if id === "time-spent-movies" || id === "double-feature"}
  <MovieIcon />
{:else if id === "time-spent-episodes"}
  <ShowIcon />
{:else if id === "century-club"}
  <TrackIcon />
{:else if id === "show-completionist"}
  <TrophyIcon />
{:else if id === "daily-streak"}
  <ChainIcon />
{:else if id === "night-owl"}
  <MoonIcon />
{:else if id === "marathon-fever"}
  <BoltIcon />
{:else if id === "perfect-ten"}
  <StarIcon fill="full" />
{:else if id === "rating-machine"}
  <StarIcon fill="half" />
{:else if id === "scribe"}
  <CommentIcon />
{:else if id === "list-maker"}
  <ListIcon />
{/if}
