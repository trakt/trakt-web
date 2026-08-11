<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import SpoilerSection from "../../_internal/SpoilerSection.svelte";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import * as m from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
  import RecapProgress from "./_internal/RecapProgress.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";

  /*
    The recap in full, ordered the way you re-enter a show: where you are
    going (up next), what happened before it (the description the header
    clamps), how you stand, what you saw last, and how you got here - the
    recent history, with the full history one drill further.
  */
  const {
    show,
    seasons,
    onClose,
  }: {
    show: ShowEntry;
    seasons?: Season[];
    onClose: () => void;
  } = $props();

  const { progress } = useShowProgress(fromRune(() => show.slug));

  const HISTORY_LIMIT = 5;
  const { list: historyList } = $derived(
    useRecentlyWatchedList({ type: "show", id: show.id }),
  );
  const recentHistory = $derived($historyList.slice(0, HISTORY_LIMIT));

  const lastEpisode = $derived($progress?.lastEpisode);

  const isBetweenSeasons = $derived(
    $progress != null &&
      lastEpisode != null &&
      $progress.season > 0 &&
      lastEpisode.season > 0 &&
      $progress.season > lastEpisode.season,
  );

  const previouslyCaption = $derived.by(() => {
    if (!lastEpisode) return null;
    if (isBetweenSeasons) {
      return m.text_recap_previously({
        season: seasonLabel(lastEpisode.season),
      });
    }
    return `${
      episodeNumberLabel({
        seasonNumber: lastEpisode.season,
        episodeNumber: lastEpisode.number,
      })
    } · ${lastEpisode.title}`;
  });

  const previouslyBlurb = $derived.by(() => {
    if (isBetweenSeasons) {
      const finished = seasons?.find(
        (season) => season.number === lastEpisode?.season,
      );
      if (finished?.overview) return finished.overview;
    }
    return lastEpisode?.overview ?? "";
  });

  /*
    Whether the next episode is actually OUT. The calendar and the premiere
    tags know this; a recap that presents an unaired premiere as "continue
    watching" is lying about the one thing it exists to say.
  */
  const isNextOut = $derived(
    $progress != null &&
      $progress.effectiveReleaseDate.getTime() <= Date.now(),
  );
  const nextEta = $derived(
    $progress != null && !isNextOut
      ? toHumanETA(new Date(), $progress.effectiveReleaseDate)
      : null,
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
  const historyLink = $derived(buildDrawerLink(SummaryDrawers.History));
  /* Notes are media-level today, so the note lands on the show. */
  const notesLink = $derived(buildDrawerLink(SummaryDrawers.Notes));
</script>

<Drawer title={m.header_recap()} {onClose}>
  <div class="trakt-recap-drawer">
    {#if $progress}
      {#if $progress.number > 0}
        <section class="recap-section">
          <h3 class="recap-section-title">
            {isNextOut ? m.list_title_up_next() : m.text_recap_coming_up()}
          </h3>
          <p class="recap-episode-line">
            <span class="recap-episode-marker">
              {episodeNumberLabel({
                seasonNumber: $progress.season,
                episodeNumber: $progress.number,
              })}
            </span>
            <span class="bold">{$progress.title}</span>
          </p>

          {#if !isNextOut && nextEta}
            <p class="recap-airing">
              <EpisodeStatusTag
                i18n={EpisodeIntlProvider}
                episodeType={$progress.type}
                releaseDate={$progress.effectiveReleaseDate}
              />
              <span class="recap-airing-eta">
                {m.text_recap_airs({ eta: nextEta })}
              </span>
            </p>
          {/if}

          <!--
            The NEXT episode's description - what the viewer is about to
            watch, so it earns the top slot but arrives spoiler-guarded: they
            have not seen it yet, which is the whole point of the guard.
          -->
          {#if $progress.overview}
            <SpoilerSection
              type="episode"
              media={{
                id: $progress.id,
                season: $progress.season,
                number: $progress.number,
              }}
              show={{ id: show.id, title: show.title }}
            >
              <p class="recap-blurb">{$progress.overview}</p>
            </SpoilerSection>
          {/if}
        </section>
      {/if}

      <!--
        The memory-jogger: the description the header's column clamps, in
        full. Unguarded on purpose - the viewer has watched what it describes.
      -->
      {#if previouslyBlurb}
        <section class="recap-section">
          {#if previouslyCaption}
            <p class="recap-caption">{previouslyCaption}</p>
          {/if}
          <p class="recap-blurb">{previouslyBlurb}</p>
        </section>
      {/if}

      <section class="recap-section">
        <RecapProgress progress={$progress} />
      </section>

      {#if lastEpisode}
        <section class="recap-section">
          <h3 class="recap-section-title">{m.text_recap_last_seen()}</h3>
          <p class="recap-episode-line">
            <span class="recap-episode-marker">
              {episodeNumberLabel({
                seasonNumber: lastEpisode.season,
                episodeNumber: lastEpisode.number,
              })}
            </span>
            <span class="bold">{lastEpisode.title}</span>
          </p>
        </section>
      {/if}
    {/if}

    {#if recentHistory.length > 0}
      <section class="recap-section">
        <SummaryHeaderSectionHeader
          title={m.list_title_history()}
          drilldown={{
            ...historyLink,
            label: m.button_label_view_all_history(),
          }}
        />
        <ul class="recap-history">
          {#each recentHistory as entry (entry.key)}
            {#if entry.type === "episode"}
              <li class="recap-history-row">
                <span class="recap-episode-marker">
                  {episodeNumberLabel({
                    seasonNumber: entry.episode.season,
                    episodeNumber: entry.episode.number,
                  })}
                </span>
                <span class="history-title ellipsis">
                  {entry.episode.title}
                </span>
                <span class="history-date">
                  {entry.watchedAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span class="history-actions">
                  <Link
                    href={notesLink.href}
                    color="inherit"
                    label={m.button_label_add_note({ title: show.title })}
                  >
                    <NotesIcon />
                  </Link>
                  <RemoveFromHistoryAction
                    {entry}
                    style="action"
                    size="small"
                    title={episodeActivityTitle(entry.episode, show)}
                  />
                </span>
              </li>
            {/if}
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-recap-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    font-size: var(--font-size-text);
  }

  .recap-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    &:not(:first-child) {
      padding-top: var(--ni-24);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }

  .recap-section-title {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .recap-episode-line {
    margin: 0;

    display: flex;
    align-items: baseline;
    gap: var(--gap-s);
  }

  .recap-episode-marker {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--purple-300);

    white-space: nowrap;
  }

  .recap-airing {
    margin: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .recap-airing-eta {
    color: var(--color-text-secondary);
  }

  .recap-caption {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .recap-blurb {
    margin: 0;

    color: var(--color-text-primary);
    line-height: 1.55;
  }

  .recap-history {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .recap-history-row {
    display: flex;
    align-items: baseline;
    gap: var(--gap-s);

    min-width: 0;
  }

  .history-title {
    min-width: 0;
  }

  .history-date {
    margin-inline-start: auto;

    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .history-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--color-text-secondary);

    :global(a) {
      display: inline-flex;
      padding: var(--ni-4);

      transition: color var(--transition-increment) ease-in-out;

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
