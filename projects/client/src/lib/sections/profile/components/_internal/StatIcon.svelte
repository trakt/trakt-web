<script lang="ts">
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import type { StatIconKey } from "./StatIconKey.ts";

  const { key }: { key: StatIconKey } = $props();
</script>

{#if key === "plays" || key === "started"}
  <PlayIcon />
{:else if key === "hours"}
  <ClockIcon />
{:else if key === "movies"}
  <MovieIcon />
{:else if key === "shows" || key === "episodes"}
  <ShowIcon />
{:else if key === "comments"}
  <CommentIcon />
{:else if key === "ratings"}
  <StarIcon fill="none" />
{:else if key === "lists"}
  <SmartListIcon />
{:else if key === "dropped"}
  <BlockIcon />
{:else if key === "finished"}
  <CheckIcon />
{/if}
