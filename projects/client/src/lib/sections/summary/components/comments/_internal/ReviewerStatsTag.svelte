<script lang="ts">
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import type { CommentTypeProps } from "../CommentsProps.ts";

  type ReviewerStatsTagProps = {
    review: MediaComment;
    media: MediaEntry | ShowEntry;
  } & CommentTypeProps;

  const { review, media, ...typeProps }: ReviewerStatsTagProps = $props();

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

  const rating = $derived(stats.rating);

  const hasStats = $derived(episodeProgress != null || Boolean(rating));
</script>

{#snippet statsTag()}
  <div class="trakt-reviewer-stats-tag">
    <StemTag>
      {#if episodeProgress}
        <span class="stats-watched" role="img" aria-label={episodeProgress.label}>
          <EyeIcon />
          <p class="bold">{episodeProgress.percentage}</p>
        </span>
      {/if}

      {#if episodeProgress && rating}
        <span class="stats-dot" aria-hidden="true">·</span>
      {/if}

      {#if rating}
        <UserRating {rating} size="small" />
      {/if}
    </StemTag>
  </div>
{/snippet}

{#if hasStats}
  {#if episodeProgress}
    <Tooltip variant="compact" content={episodeProgress.label}>
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

    .stats-dot {
      opacity: var(--de-emphasized-opacity);
    }
  }
</style>
