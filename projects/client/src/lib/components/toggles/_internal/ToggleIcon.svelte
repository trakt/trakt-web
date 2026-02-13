<script lang="ts" generics="T">
  import FollowersIcon from "$lib/components/icons/FollowersIcon.svelte";
  import FollowingIcon from "$lib/components/icons/FollowingIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import NoSpoilerIcon from "$lib/components/icons/NoSpoilerIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import PopularIcon from "$lib/components/icons/PopularIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SpoilerIcon from "$lib/components/icons/SpoilerIcon.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";

  interface ToggleIconProps {
    option: ToggleOption<T>;
  }

  const { option }: ToggleIconProps = $props();

  const { user } = useUser();

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
