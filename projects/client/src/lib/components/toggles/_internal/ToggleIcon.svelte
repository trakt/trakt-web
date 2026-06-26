<script lang="ts" generics="T">
  import BrainIcon from "$lib/components/icons/BrainIcon.svelte";
  import CastIcon from "$lib/components/icons/CastIcon.svelte";
  import ShuffleIcon from "$lib/components/icons/ShuffleIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import CrewIcon from "$lib/components/icons/CrewIcon.svelte";
  import CustomLibraryIcon from "$lib/components/icons/CustomLibraryIcon.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import FollowersIcon from "$lib/components/icons/FollowersIcon.svelte";
  import FollowingIcon from "$lib/components/icons/FollowingIcon.svelte";
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import NoSpoilerIcon from "$lib/components/icons/NoSpoilerIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import PopularIcon from "$lib/components/icons/PopularIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SpoilerIcon from "$lib/components/icons/SpoilerIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";

  interface ToggleIconProps {
    option: ToggleOption<T>;
  }

  const { option }: ToggleIconProps = $props();
  // FIXME: make the icon a prop of ToggleOption
</script>

{#if option.value === "all" || option.value === "media"}
  <MediaIcon />
{/if}

{#if option.value === "movie"}
  <MovieIcon />
{/if}

{#if option.value === "show" || option.value === "episode"}
  <ShowIcon />
{/if}

{#if option.value === "people"}
  <PeopleIcon />
{/if}

{#if option.value === "following"}
  <FollowingIcon />
{/if}

{#if option.value === "followers"}
  <FollowersIcon />
{/if}

{#if option.value === "requests"}
  <HourglassIcon />
{/if}

{#if option.value === "newest"}
  <RecentIcon />
{/if}

{#if option.value === "likes"}
  <PopularIcon />
{/if}

{#if option.value === "spoilers"}
  <SpoilerIcon />
{/if}

{#if option.value === "no-spoilers"}
  <NoSpoilerIcon />
{/if}

{#if option.value === "lists"}
  <ListIcon />
{/if}

{#if option.value === "in-progress"}
  <HourglassIcon />
{/if}

{#if option.value === "completed"}
  <TrackIcon />
{/if}

{#if option.value === "dropped"}
  <DropIcon />
{/if}

{#if option.value === "reviews"}
  <CommentIcon />
{/if}

{#if option.value === "ratings"}
  <RatingIcon variant="user" style="unrated" />
{/if}

{#if option.value === "plex"}
  <PlexLibraryIcon />
{/if}

{#if option.value === "other"}
  <CustomLibraryIcon />
{/if}

{#if option.value === "cast"}
  <CastIcon />
{/if}

{#if option.value === "crew"}
  <CrewIcon />
{/if}

{#if option.value === "standard"}
  <ShuffleIcon />
{/if}

{#if option.value === "smart"}
  <BrainIcon />
{/if}
