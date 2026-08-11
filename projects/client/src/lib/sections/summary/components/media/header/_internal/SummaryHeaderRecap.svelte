<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import RecapProgress from "./RecapProgress.svelte";

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

  <RecapProgress {progress} />
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






</style>
