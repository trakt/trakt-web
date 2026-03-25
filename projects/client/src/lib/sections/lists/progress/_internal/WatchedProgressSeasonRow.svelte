<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { WatchedProgressSeason } from "$lib/requests/models/WatchedProgressEntry.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const {
    season,
    showRuntime = 30,
    showSlug,
  }: {
    season: WatchedProgressSeason;
    showRuntime?: number;
    showSlug: string;
  } = $props();

  const remaining = $derived(season.aired - season.completed);
  const percentage = $derived(
    season.aired > 0 ? Math.round((season.completed / season.aired) * 100) : 0,
  );

  const watchedDuration = $derived(
    toHumanDuration({ minutes: season.completed * showRuntime }),
  );
  const remainingDuration = $derived(
    toHumanDuration({ minutes: remaining * showRuntime }),
  );

  const episodeLabel = (
    seasonNumber: number,
    episodeNumber: number,
  ): string => {
    return `${seasonNumber}x${String(episodeNumber).padStart(2, "0")}`;
  };

  const episodeDuration = $derived(
    toHumanDuration({ minutes: showRuntime }),
  );

  const tooltipForEpisode = (
    episode: { number: number; completed: boolean; lastWatchedAt: Date | null },
  ): string => {
    const label = episodeLabel(season.number, episode.number);
    if (!episode.completed) return `${label}<br>Not watched`;

    const lines = [label, `1 play — ${episodeDuration || "0m"}`];
    if (episode.lastWatchedAt) {
      const date = episode.lastWatchedAt.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      lines.push(`<span class="tooltip-last-watched">Last watched on<br>${date}</span>`);
    }
    return lines.join("<br>");
  };
</script>

<div class="season-row">
  <div class="season-top">
    <a
      href="/shows/{showSlug}/seasons/{season.number}"
      class="season-label bold"
    >
      Season {season.number}{#if season.title}: {season.title}{/if}
    </a>

    <div class="season-pills">
      <span class="pill" data-variant="episodes">
        {season.completed}/{season.aired} episodes
      </span>
      <span class="pill" data-variant="watched">
        {season.completed} {season.completed === 1 ? "play" : "plays"} ({watchedDuration || "0m"})
      </span>
      {#if remaining > 0}
        <span class="pill" data-variant="remaining">
          {remaining} remaining ({remainingDuration || "0m"})
        </span>
      {/if}
    </div>
  </div>

  <div class="season-bar">
    <div
      class="season-progress"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {#each season.episodes as episode (episode.number)}
        <Tooltip content={tooltipForEpisode(episode)} variant="compact" html>
          <a
            href={UrlBuilder.episode(showSlug, season.number, episode.number)}
            class="progress-segment"
            class:is-watched={episode.completed}
            aria-label={episodeLabel(season.number, episode.number)}
          ></a>
        </Tooltip>
      {/each}
    </div>
    <span class="season-pct bold">{percentage}%</span>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .season-row {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    padding: var(--ni-10) 0;

    &:not(:last-child) {
      border-bottom: 1px solid
        color-mix(in srgb, var(--shade-700) 40%, transparent);
    }
  }

  .season-top {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-wrap: wrap;
  }

  .season-label {
    font-size: var(--ni-14);
    color: var(--color-text-primary);
    text-decoration: none;

    &:visited {
      color: var(--color-text-primary);
    }
  }

  .season-pills {
    display: flex;
    gap: var(--ni-4);
    margin-left: auto;
  }

  .pill {
    font-size: var(--ni-11);
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--ni-10);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    line-height: 1.4;

    &[data-variant="episodes"] {
      background: color-mix(in srgb, var(--purple-800) 40%, transparent);
      color: var(--purple-300);
    }

    &[data-variant="watched"] {
      background: color-mix(in srgb, var(--shade-800) 50%, transparent);
      color: var(--color-text-secondary);
    }

    &[data-variant="remaining"] {
      background: color-mix(in srgb, var(--shade-800) 50%, transparent);
      color: var(--color-text-secondary);
    }
  }

  /* Progress bar + percentage as right column */
  .season-bar {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .season-progress {
    flex: 1;
    display: flex;
    gap: 2px;
    height: var(--ni-6);
    border-radius: var(--border-radius-xs);
    overflow: hidden;

    :global(.trakt-tooltip-trigger) {
      flex: 1;
      min-width: 0;
    }

    :global(.trakt-tooltip-compact) {
      margin-left: 0;
      white-space: normal;
      line-height: 1.8;
      text-align: center;
    }

    :global(.tooltip-last-watched) {
      display: block;
      border-top: 1px solid
        color-mix(in srgb, var(--color-tooltip-text) 20%, transparent);
      padding-top: var(--ni-4);
      margin-top: var(--ni-4);
    }
  }

  .season-pct {
    font-size: var(--ni-13);
    color: var(--purple-400);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    min-width: var(--ni-36);
    text-align: right;
  }

  .progress-segment {
    width: 100%;
    height: 100%;
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
</style>
