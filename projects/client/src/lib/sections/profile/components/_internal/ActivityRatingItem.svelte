<script lang="ts">
  import type { UserRatingEntry } from "$lib/requests/queries/users/userRatingsQuery.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";

  const {
    entry,
    style = "cover",
  }: { entry: UserRatingEntry; style?: "summary" | "cover" | "compact" } =
    $props();
</script>

{#snippet action()}
  <UserRating rating={entry.rating} />
{/snippet}

{#if entry.type === "episode"}
  <EpisodeItem
    episode={entry.episode}
    media={entry.show}
    variant="activity"
    activityType="personal"
    date={entry.ratedAt}
    source="ratings"
    {style}
    {action}
  />
{:else if entry.type === "show"}
  <MediaItem
    type="show"
    media={entry.show}
    source="ratings"
    variant="activity"
    activityType="personal"
    date={entry.ratedAt}
    {style}
    {action}
  />
{:else}
  <MediaItem
    type="movie"
    media={entry.movie}
    source="ratings"
    variant="activity"
    activityType="personal"
    date={entry.ratedAt}
    {style}
    {action}
  />
{/if}
