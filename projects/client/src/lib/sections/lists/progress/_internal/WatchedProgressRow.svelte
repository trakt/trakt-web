<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { WatchedProgressEntry } from "$lib/requests/models/WatchedProgressEntry.ts";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { slide } from "svelte/transition";
  import WatchedProgressSeasonRow from "./WatchedProgressSeasonRow.svelte";

  const {
    entry,
    showRuntime = 30,
  }: {
    entry: WatchedProgressEntry;
    showRuntime?: number;
  } = $props();

  let isExpanded = $state(false);

  const remaining = $derived(entry.aired - entry.completed);
  const remainingDuration = $derived(
    toHumanDuration({ minutes: remaining * showRuntime }),
  );

  const plays = $derived(entry.plays ?? entry.completed);
  const playsDuration = $derived(
    toHumanDuration({ minutes: plays * showRuntime }),
  );

  const nextEpisodeLabel = $derived(
    entry.nextEpisode
      ? episodeNumberLabel({
          seasonNumber: entry.nextEpisode.season,
          episodeNumber: entry.nextEpisode.number,
        })
      : null,
  );

  const lastWatched = $derived(() => {
    if (!entry.lastEpisode || !entry.lastWatchedAt) return null;
    const label = episodeNumberLabel({
      seasonNumber: entry.lastEpisode.season,
      episodeNumber: entry.lastEpisode.number,
    });
    const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diffDays = Math.round(
      (entry.lastWatchedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return {
      episode: `${label} "${entry.lastEpisode.title}"`,
      relative: relative.format(diffDays, "day"),
    };
  });

  const nextEpisodeScreenshot = $derived(
    entry.nextEpisode?.screenshot ?? EPISODE_COVER_PLACEHOLDER,
  );

  const nextEpisodeUrl = $derived(
    entry.nextEpisode
      ? UrlBuilder.episode(
          entry.show.slug,
          entry.nextEpisode.season,
          entry.nextEpisode.number,
        )
      : null,
  );

  const allEpisodes = $derived(
    entry.seasons.flatMap((s) =>
      s.episodes.map((ep) => ({ ...ep, season: s.number }))
    ),
  );

  const AIRING_STATUSES = ["returning series", "continuing"];
  const isCompleted = $derived(
    entry.percentage === 100 && !entry.nextEpisode,
  );
  const isReturning = $derived(
    AIRING_STATUSES.includes(entry.show.status),
  );
  const completedStatusText = $derived(
    isReturning
      ? m.watched_progress_returns_next_season()
      : toTranslatedStatus(entry.show.status),
  );
</script>

{#snippet nextEpisodeAction()}
  <RenderFor audience="authenticated">
    <MarkAsWatchedAction
      mode="act"
      style="action"
      type="episode"
      size="small"
      title={entry.nextEpisode?.title ?? ""}
      media={{
        id: entry.nextEpisode?.id ?? 0,
        season: entry.nextEpisode?.season ?? 0,
        number: entry.nextEpisode?.number ?? 0,
        airDate: new Date(0),
      }}
      show={{ id: entry.show.id, title: entry.show.title }}
    />
  </RenderFor>
{/snippet}

<article class="progress-row">
  <!-- Show Poster -->
  <div class="poster-area">
    <a href="/shows/{entry.show.slug}" class="poster-link">
      <CrossOriginImage
        src={entry.show.poster.thumb}
        alt={entry.show.title}
        classList="poster-img"
      />
    </a>
    <RenderFor audience="authenticated">
      <div class="poster-menu">
        <PopupMenu
          label="Actions for {entry.show.title}"
          mode="overlay"
          size="small"
        >
          {#snippet items()}
            <DropAction
              style="dropdown-item"
              title={entry.show.title}
              id={entry.show.id}
              type="show"
            />
          {/snippet}
        </PopupMenu>
      </div>
    </RenderFor>
  </div>

  <!-- Progress Wrapper (rounded) -->
  <div class="progress-wrapper">
    <div class="progress-header">
      <div class="header">
        <a
          href="/shows/{entry.show.slug}"
          class="show-title ellipsis"
        >
          {entry.show.title}
        </a>
        {#if entry.show.year}
          <span class="year">({entry.show.year})</span>
        {/if}
      </div>

      <!-- Segmented Progress Bar -->
      <div class="progress-row-bar">
        <div class="progress-track">
          {#each allEpisodes as ep, i (i)}
            <a
              href={UrlBuilder.episode(entry.show.slug, ep.season, ep.number)}
              class="progress-seg"
              class:is-watched={ep.completed}
              aria-label="{ep.season}x{String(ep.number).padStart(2, '0')}"
            ></a>
          {/each}
        </div>
        <span class="progress-pct bold">{entry.percentage}%</span>
      </div>

      <!-- Stats -->
      <div class="show-pills">
        <span class="show-pill" data-variant="watched">
          {entry.completed}/{entry.aired} watched
        </span>
        <span class="show-pill" data-variant="plays">
          {plays} {plays === 1 ? "play" : "plays"} ({playsDuration || "0m"})
        </span>
        {#if remaining > 0}
          <span class="show-pill" data-variant="remaining">
            {remaining} remaining ({remainingDuration || "0m"})
          </span>
        {/if}
      </div>

      {#if lastWatched()}
        <div class="last-watched">
          <span class="last-watched-label">Last watched</span>
          <a
            href={UrlBuilder.episode(entry.show.slug, entry.lastEpisode!.season, entry.lastEpisode!.number)}
            class="last-watched-episode"
          >
            {lastWatched()?.episode}
          </a>
          <span class="last-watched-time">{lastWatched()?.relative}</span>
        </div>
      {/if}

      <button
        class="expand-toggle"
        onclick={() => (isExpanded = !isExpanded)}
        aria-expanded={isExpanded}
        aria-label="{entry.show.title} — {isExpanded
          ? m.watched_progress_hide_seasons()
          : m.watched_progress_view_seasons()}"
      >
        <CollapseIcon state={isExpanded ? "expanded" : "collapsed"} />
        <span>
          {isExpanded
            ? m.watched_progress_hide_seasons()
            : m.watched_progress_view_seasons()}
        </span>
      </button>
    </div>

    <!-- Expanded Seasons -->
    {#if isExpanded}
      <div class="seasons-detail" transition:slide={{ duration: 150 }}>
        {#each entry.seasons as season (season.number)}
          <WatchedProgressSeasonRow
            {season}
            {showRuntime}
            showSlug={entry.show.slug}
          />
        {/each}
      </div>
    {/if}
  </div>

  <!-- Next Episode or Completed Fanart -->
  {#if entry.nextEpisode}
    <div class="next-episode-area">
      <LandscapeCard>
        <a href={nextEpisodeUrl} class="card-cover-link">
          <CardCover
            src={nextEpisodeScreenshot}
            alt={entry.nextEpisode.title}
            title={entry.nextEpisode.title}
          />
        </a>
        <CardFooter action={nextEpisodeAction}>
          <p class="trakt-card-title ellipsis">
            <Spoiler
              media={entry.nextEpisode}
              show={{ id: entry.show.id, title: entry.show.title }}
              type="episode"
            >
              {entry.nextEpisode.title}
            </Spoiler>
          </p>
          <p class="trakt-card-subtitle ellipsis">
            {nextEpisodeLabel}
          </p>
        </CardFooter>
      </LandscapeCard>
    </div>
  {:else if isCompleted}
    <div class="completed-area">
      <LandscapeCard>
        <a href="/shows/{entry.show.slug}" class="card-cover-link">
          <CardCover
            src={entry.show.fanart.thumb}
            alt={entry.show.title}
            title={entry.show.title}
          />
        </a>
        <CardFooter>
          <p
            class="trakt-card-title ellipsis"
            class:completed-returning={isReturning}
          >
            {completedStatusText}
          </p>
          <p class="trakt-card-subtitle ellipsis">
            {entry.aired} episodes
          </p>
        </CardFooter>
      </LandscapeCard>
    </div>
  {/if}
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .progress-row {
    display: grid;
    grid-template-columns: var(--width-portrait-card) 1fr auto;
    gap: var(--gap-m);
    align-items: start;

    @include for-mobile {
      grid-template-columns: var(--ni-80) 1fr;
      grid-template-rows: auto auto;
      gap: var(--gap-s);
    }
  }

  /* Poster */
  .poster-area {
    position: relative;
  }

  .poster-link {
    display: block;
    width: var(--width-portrait-card);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;

    @include for-mobile {
      width: var(--ni-80);
    }
  }

  :global(.poster-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .poster-menu {
    position: absolute;
    top: var(--ni-2);
    right: var(--ni-2);
  }

  /* Progress Wrapper */
  .progress-wrapper {
    background: color-mix(
      in srgb,
      var(--color-floating-background) 60%,
      transparent
    );
    border-radius: var(--border-radius-m);
    overflow: hidden;
    min-width: 0;
  }

  .progress-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--ni-16);
  }

  .header {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .show-title {
    color: var(--color-text-primary);
    font-size: var(--ni-18);
    font-weight: 700;
    text-decoration: none;

    &:visited {
      color: var(--color-text-primary);
    }
  }

  .year {
    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    flex-shrink: 0;
  }

  /* Segmented Progress Bar */
  .progress-row-bar {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .progress-track {
    flex: 1;
    display: flex;
    gap: 2px;
    height: var(--ni-8);
    border-radius: var(--border-radius-xs);
    overflow: hidden;
  }

  .progress-seg {
    flex: 1;
    background-color: var(--shade-800);
    transition: background-color var(--transition-increment) ease-in;

    &.is-watched {
      background-color: var(--purple-500);
    }

    @include for-mouse {
      &:hover {
        background-color: var(--shade-600);

        &.is-watched {
          background-color: var(--purple-400);
        }
      }
    }
  }

  .progress-pct {
    font-size: var(--ni-14);
    color: var(--purple-400);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    min-width: var(--ni-36);
    text-align: right;
  }

  /* Stats */
  .show-pills {
    display: flex;
    gap: var(--ni-4);
    flex-wrap: wrap;
  }

  .show-pill {
    font-size: var(--ni-12);
    font-weight: 600;
    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--ni-10);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    line-height: 1.4;

    &[data-variant="watched"] {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--purple-800) 50%, transparent),
        color-mix(in srgb, var(--purple-700) 25%, transparent)
      );
      color: var(--purple-200);
    }

    &[data-variant="plays"] {
      background: color-mix(in srgb, var(--shade-800) 50%, transparent);
      color: var(--color-text-secondary);
    }

    &[data-variant="remaining"] {
      background: color-mix(in srgb, var(--shade-800) 50%, transparent);
      color: var(--color-text-secondary);
    }
  }

  .last-watched {
    display: flex;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-12);
    padding: var(--ni-10) 0;
    margin: var(--ni-4) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--shade-700) 30%, transparent);

    .last-watched-label {
      color: var(--shade-500);
    }

    .last-watched-episode {
      color: var(--color-text-primary);
      font-weight: 500;
      text-decoration: none;

      &:visited {
        color: var(--color-text-primary);
      }
    }

    .last-watched-time {
      color: var(--shade-500);

      &::before {
        content: "\00b7";
        margin-right: var(--ni-6);
      }
    }
  }

  .expand-toggle {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    color: var(--color-text-secondary);
    font-size: var(--ni-12);
    font-weight: 500;
    align-self: flex-start;
    padding: var(--ni-6) var(--ni-12);
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--shade-800) 40%, transparent);
    cursor: pointer;
    transition:
      background var(--transition-increment) ease-in,
      color var(--transition-increment) ease-in;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--shade-700) 50%, transparent);
        color: var(--color-text-primary);
      }
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  /* Expanded Seasons */
  .seasons-detail {
    padding: var(--ni-8) var(--ni-16) var(--ni-16);
    background: color-mix(in srgb, var(--shade-940) 60%, transparent);
  }

  /* Next Episode Card / Completed Fanart */
  .next-episode-area,
  .completed-area {
    flex-shrink: 0;

    @include for-mobile {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }

  .card-cover-link {
    display: block;
  }

  :global(.completed-returning) {
    color: var(--purple-300);
  }
</style>
