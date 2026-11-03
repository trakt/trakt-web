<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";
  import { recapMarked } from "./recapMarked.ts";

  /*
    What you saw last, with its blurb. The standing itself (behind / up to date,
    time left) sits on the column's subline above this, as a state pill - see
    SummaryHeaderStanding, which the recap drawer renders too. The blurb is the
    LAST SEEN episode's, so it is never a
    spoiler - the reader has watched it; it is here to jog the memory before
    diving back in.

    Between seasons - the next episode opens a season the last one closed - the
    memory that needs jogging is the whole season, so that season's recap
    (or its overview, when there is no recap) takes the blurb slot instead.
  */
  const {
    progress,
    finishedSeasonBlurb,
  }: {
    progress: EpisodeProgressEntry;
    /** The just-finished season's recap or overview, between seasons. */
    finishedSeasonBlurb: string | null;
  } = $props();

  const lastEpisode = $derived(progress.lastEpisode);

  const isBetweenSeasons = $derived(
    lastEpisode != null &&
      progress.season > 0 &&
      lastEpisode.season > 0 &&
      progress.season > lastEpisode.season,
  );

  const blurb = $derived.by(() => {
    if (isBetweenSeasons && finishedSeasonBlurb) {
      return finishedSeasonBlurb;
    }
    return lastEpisode?.overview ?? "";
  });

</script>

<div class="trakt-summary-header-recap">
  {#if lastEpisode}
    <p class="recap-last-seen">
      <SummaryHeaderLabel text={m.text_recap_last_seen()} />
      <!--
        Same bullet the episode marker itself uses, spoken in the same label
        metrics - a body-size middot next to 10px caps rides above their
        optical centre no matter what the row aligns on.
      -->
      <span aria-hidden="true">
        <SummaryHeaderLabel text="&bullet;" />
      </span>
      <span class="recap-episode">
        <SummaryHeaderLabel
          text={episodeNumberLabel({
            seasonNumber: lastEpisode.season,
            episodeNumber: lastEpisode.number,
          })}
        />
      </span>
    </p>
  {/if}

  {#if isBetweenSeasons}
    <p class="recap-previously">
      <SummaryHeaderLabel
        text={m.text_recap_previously({
          season: seasonLabel(lastEpisode?.season ?? 0),
        })}
      />
    </p>
  {/if}

  {#if blurb}
    <p class="recap-blurb">{@html recapMarked.parseInline(blurb)}</p>
  {/if}
</div>

<style lang="scss">
  .trakt-summary-header-recap {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    min-width: 0;
    width: 100%;

    font-size: var(--font-size-text);

    --summary-header-label-color: var(--color-text-quiet);
  }

  .recap-last-seen {
    margin: 0;

    /*
     * Baselines, not box centres: the marker sits in a wrapper that sets its
     * colour, and centring boxes let that wrapper's line box nudge the text
     * off the line its neighbours sit on.
     */
    display: flex;
    align-items: baseline;
    gap: var(--gap-xxs);

    color: var(--color-text-quiet);
  }

  /* The episode marker is the same label, spoken louder than its prefix. */
  .recap-episode {
    --summary-header-label-color: var(--color-text-primary);
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

    :global(strong) {
      font-weight: 600;
    }
  }






</style>
