<script lang="ts">
  import type { UserRatingEntry } from "$lib/requests/queries/users/userRatingsQuery.ts";
  import RateAction from "$lib/sections/media-actions/rating/RateAction.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";
  import MediaSummaryCard from "$lib/sections/lists/components/MediaSummaryCard.svelte";
  import type { RateNowProps } from "$lib/sections/summary/components/rating/models/RateNowProps";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
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

  const rateTarget = $derived.by<RateNowProps>(() => {
    switch (entry.type) {
      case "movie":
        return { type: "movie", media: entry.movie };
      case "show":
        return { type: "show", media: entry.show };
      case "season":
        return { type: "season", media: entry.season, show: entry.show };
      case "episode":
        return { type: "episode", media: entry.episode, show: entry.show };
    }
  });

  const rateTitle = $derived.by(() => {
    switch (entry.type) {
      case "movie":
        return entry.movie.title;
      case "show":
        return entry.show.title;
      case "season":
        return seasonLabel(entry.season.number, entry.show.title);
      case "episode":
        return episodeActivityTitle(entry.episode, entry.show);
    }
  });
</script>

{#snippet action()}
  <RateAction
    target={rateTarget}
    title={rateTitle}
    style={style === "cover" ? "cover" : "summary"}
  />
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
