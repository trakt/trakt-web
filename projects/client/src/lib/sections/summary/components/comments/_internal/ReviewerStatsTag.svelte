<script lang="ts">
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import PlayArrowIcon from "$lib/components/icons/PlayArrowIcon.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider.ts";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import type { CommentTypeProps } from "../CommentsProps.ts";

  type ReviewerStatsTagProps = {
    review: MediaComment;
    media: MediaEntry | ShowEntry;
    isOwnReview: boolean;
  } & CommentTypeProps;

  const { review, media, isOwnReview, ...typeProps }: ReviewerStatsTagProps =
    $props();

  const stats = $derived(review.user.stats);

  const episodeTotal = $derived.by(() => {
    switch (typeProps.type) {
      case "season":
        return typeProps.episodeCount;
      case "show":
        return "episode" in media
          ? media.episode.count
          : undefined;
      default:
        return undefined;
    }
  });

  const isEpisodic = $derived(
    typeProps.type === "show" || typeProps.type === "season",
  );

  const episodeProgress = $derived.by(() => {
    if (!episodeTotal) return undefined;

    const completed = Math.min(stats.completedCount, episodeTotal);
    if (completed <= 0) return undefined;

    return {
      label: m.tooltip_text_watched_episodes({
        completed,
        total: episodeTotal,
      }),
      percentage: toPercentage(completed / episodeTotal, getLocale()),
    };
  });

  const playCount = $derived(
    !isEpisodic && stats.playCount > 0 ? stats.playCount : undefined,
  );

  const rating = $derived(stats.rating);

  const watchedLabel = $derived.by(() => {
    if (episodeProgress) return episodeProgress.label;
    if (playCount != null) return TagIntlProvider.toPlayCount(playCount);
    return undefined;
  });

  const hasStats = $derived(watchedLabel != null || Boolean(rating));

  const playLabel = $derived(
    playCount == null ? undefined : toHumanNumber(playCount, languageTag()),
  );
</script>

{#snippet statsTag()}
  <div class="trakt-reviewer-stats-tag">
    <StemTag>
      {#if episodeProgress}
        <span class="stats-watched" role="img" aria-label={watchedLabel}>
          <EyeIcon />
          <p class="bold">{episodeProgress.percentage}</p>
        </span>
      {:else if playCount != null}
        <span
          class="stats-watched stats-plays"
          role="img"
          aria-label={watchedLabel}
        >
          <PlayArrowIcon />
          <p class="bold">{playLabel}</p>
        </span>
      {/if}

      {#if watchedLabel && rating}
        <span class="stats-dot" aria-hidden="true">·</span>
      {/if}

      {#if rating}
        <UserRating {rating} size="small" />
      {/if}
    </StemTag>
  </div>
{/snippet}

{#if !isOwnReview && hasStats}
  {#if watchedLabel}
    <Tooltip variant="compact" content={watchedLabel}>
      {@render statsTag()}
    </Tooltip>
  {:else}
    {@render statsTag()}
  {/if}
{/if}

<style>
  .trakt-reviewer-stats-tag {
    display: flex;

    :global(.trakt-tag) {
      cursor: default;
      user-select: none;
    }

    .stats-watched {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    .stats-plays {
      gap: var(--ni-2);
    }

    .stats-dot {
      opacity: var(--de-emphasized-opacity);
    }
  }
</style>
