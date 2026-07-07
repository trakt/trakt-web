<script lang="ts">
  import type { UserRatingEntry } from "$lib/requests/queries/users/userRatingsQuery.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";
  import MediaSummaryCard from "$lib/sections/lists/components/MediaSummaryCard.svelte";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";

  const {
    entry,
    style = "cover",
  }: { entry: UserRatingEntry; style?: "summary" | "cover" | "compact" } =
    $props();

  const shared = $derived({
    variant: "activity" as const,
    activityType: "personal" as const,
    date: entry.ratedAt,
    source: "ratings" as const,
    style,
  });

  const mediaProps = $derived(
    entry.type === "movie"
      ? { type: "movie" as const, media: entry.movie }
      : {
        type: "show" as const,
        media: entry.show,
        subtitle: entry.type === "season"
          ? seasonLabel(entry.season.number)
          : undefined,
      },
  );
</script>

{#snippet action()}
  <UserRating rating={entry.rating} />
{/snippet}

{#if entry.type === "season" && style !== "cover"}
  <MediaSummaryCard
    type="season"
    season={entry.season}
    media={entry.show}
    source="ratings"
    layout={style === "compact" ? "compact" : "default"}
    badge={action}
  />
{:else if entry.type === "episode"}
  <EpisodeItem episode={entry.episode} media={entry.show} {...shared} {action} />
{:else}
  <MediaItem {...mediaProps} {...shared} {action} />
{/if}
