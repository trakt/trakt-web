<script lang="ts">
  import BarsIcon from "$lib/components/icons/BarsIcon.svelte";
  import BoltIcon from "$lib/components/icons/BoltIcon.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ChainIcon from "$lib/components/icons/ChainIcon.svelte";
  import ClapperboardIcon from "$lib/components/icons/ClapperboardIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import CrownIcon from "$lib/components/icons/CrownIcon.svelte";
  import CustomLibraryIcon from "$lib/components/icons/CustomLibraryIcon.svelte";
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
  import InfinityIcon from "$lib/components/icons/InfinityIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MoonIcon from "$lib/components/icons/MoonIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import RestoreIcon from "$lib/components/icons/RestoreIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import TrendDownIcon from "$lib/components/icons/TrendDownIcon.svelte";
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
{:else if id === "active-logger"}
  <CalendarIcon />
{:else if id === "daily-streak"}
  <ChainIcon />
{:else if id === "night-owl"}
  <MoonIcon />
{:else if id === "marathon-fever"}
  <BoltIcon />
{:else if id === "show-completionist"}
  <TrophyIcon />
{:else if id === "re-watcher"}
  <FastRewindIcon />
{:else if id === "perfect-ten"}
  <StarIcon fill="full" />
{:else if id === "harsh-critic"}
  <TrendDownIcon />
{:else if id === "rating-machine"}
  <StarIcon fill="half" />
{:else if id === "scribe"}
  <CommentIcon />
{:else if id === "balanced-critic"}
  <BarsIcon />
{:else if id === "list-maker"}
  <ListIcon />
{:else if id === "vault-keeper"}
  <CustomLibraryIcon />
{:else if id === "vip-limit-breaker"}
  <CrownIcon />
{:else if id === "plex-archivist"}
  <PlexLibraryIcon />
{:else if id === "vip-loyalty"}
  <CrownIcon />
{:else if id === "trakt-veteran"}
  <ClockIcon />
{:else if id === "life-backer"}
  <InfinityIcon />
{:else if id === "phoenix-rescue"}
  <RestoreIcon />
{:else}
  <ClapperboardIcon />
{/if}
