<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import BulletListIcon from "$lib/components/icons/BulletListIcon.svelte";
  import CastIcon from "$lib/components/icons/CastIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { NextStepId } from "$lib/features/next-steps/NextStepId.ts";

  const { id }: { id: NextStepId } = $props();
</script>

{#if id === NextStepId.WatchHistory}
  <EyeIcon />
{:else if id === NextStepId.Watchlist}
  <BookmarkIcon state="missing" />
{:else if id === NextStepId.Rate}
  <StarIcon fill="none" />
{:else if id === NextStepId.FavoriteGenres}
  <SparkleStarIcon />
{:else if id === NextStepId.FavoriteServices}
  <CastIcon />
{:else if id === NextStepId.StreamingSync}
  <PlugIcon />
{:else if id === NextStepId.Follow}
  <PeopleIcon />
{:else if id === NextStepId.CreateList}
  <BulletListIcon />
{:else}
  <CommentIcon style="open" />
{/if}
