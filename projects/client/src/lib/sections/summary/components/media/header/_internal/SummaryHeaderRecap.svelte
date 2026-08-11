<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";

  /*
    Where you stand with the show: what you saw last, how far along you are,
    and how much is left. The blurb is the LAST SEEN episode's, so it is never
    a spoiler - the reader has watched it; it is here to jog the memory before
    diving back in.

    Between seasons - the next episode opens a season the last one closed - the
    memory that needs jogging is the whole season, so the previous season's
    overview takes the blurb slot instead.
  */
  const {
    progress,
    previousSeasonOverview,
  }: {
    progress: EpisodeProgressEntry;
    /** The just-finished season's overview, when sitting between seasons. */
    previousSeasonOverview: string | null;
  } = $props();

  const lastEpisode = $derived(progress.lastEpisode);

  const isBetweenSeasons = $derived(
    lastEpisode != null &&
      progress.season > 0 &&
      lastEpisode.season > 0 &&
      progress.season > lastEpisode.season,
  );

  const blurb = $derived.by(() => {
    if (isBetweenSeasons && previousSeasonOverview) {
      return previousSeasonOverview;
    }
    return lastEpisode?.overview ?? "";
  });

  const percentage = $derived(
    progress.total > 0 ? (progress.completed / progress.total) * 100 : 0,
  );

  const timeLeft = $derived(
    progress.minutesLeft > 0
      ? toHumanDuration({ minutes: progress.minutesLeft, clampAt: "day" })
      : null,
  );
</script>

<div class="trakt-summary-header-recap">
  {#if lastEpisode}
    <p class="recap-last-seen">
      <span class="recap-label">{m.text_recap_last_seen()}</span>
      <span aria-hidden="true">·</span>
      <span class="recap-episode">
        {episodeNumberLabel({
          seasonNumber: lastEpisode.season,
          episodeNumber: lastEpisode.number,
        })}
      </span>
    </p>
  {/if}

  {#if isBetweenSeasons}
    <p class="recap-label recap-previously">
      {m.text_recap_previously({
        season: seasonLabel(lastEpisode?.season ?? 0),
      })}
    </p>
  {/if}

  {#if blurb}
    <p class="recap-blurb">{blurb}</p>
  {/if}

  <div
    class="recap-bar"
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={progress.total}
    aria-valuenow={progress.completed}
  >
    <div class="recap-bar-fill" style:width="{percentage}%"></div>
  </div>

  <div class="recap-standing">
    {#if progress.remaining > 0}
      <span class="recap-behind">
        {m.text_recap_behind({ count: progress.remaining })}
      </span>
    {:else}
      <span class="recap-caught-up">{m.text_recap_caught_up()}</span>
    {/if}

    <span class="recap-totals">
      {m.text_recap_of_total({
        completed: progress.completed,
        total: progress.total,
      })}{#if timeLeft}
        · {m.text_recap_time_left({ duration: timeLeft })}{/if}
    </span>
  </div>
</div>

<style lang="scss">
  .trakt-summary-header-recap {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    min-width: 0;
    width: 100%;

    font-size: var(--font-size-text);
  }

  .recap-last-seen {
    margin: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--color-text-secondary);
  }

  .recap-label {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .recap-episode {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .recap-previously {
    margin: 0;
  }

  .recap-blurb {
    margin: 0;

    color: var(--color-text-primary);
    line-height: 1.5;

    /* Two lines, then quiet - the drilldown holds the rest. */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }

  .recap-bar {
    width: 100%;
    height: var(--ni-4);
    border-radius: var(--ni-2);

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    overflow: hidden;
  }

  .recap-bar-fill {
    height: 100%;
    border-radius: inherit;

    background: var(--purple-500);
  }

  .recap-standing {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .recap-behind {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--orange-400);
  }

  .recap-caught-up {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--green-400);
  }

  .recap-totals {
    color: var(--color-text-secondary);
    font-size: var(--font-size-text);
  }
</style>
