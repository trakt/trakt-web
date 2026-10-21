<script lang="ts">
  import { untrack } from "svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import SeasonEpisodes from "./SeasonEpisodes.svelte";
  import type { SeasonWatchState } from "./SeasonWatchState.ts";
  import WatchProgressLine from "./WatchProgressLine.svelte";

  const {
    state: season,
    showSlug,
    show,
    upNextEpisodeId,
    isExpanded,
    onToggle,
  }: {
    state: SeasonWatchState;
    showSlug: string;
    show: { id: number; title: string };
    upNextEpisodeId: number | Nil;
    isExpanded: boolean;
    onToggle: () => void;
  } = $props();

  const label = $derived(seasonLabel(season.number));

  const isStarted = $derived(season.watched > 0);

  const status = $derived.by(() => {
    if (season.aired === 0) return m.text_watch_state_not_aired();
    if (season.isComplete) return m.text_watch_state_complete();
    if (!isStarted) return m.text_season_not_started();

    return m.text_watch_state_count({
      watched: season.watched,
      total: season.aired,
    });
  });

  const contentId = $derived(`watch-state-season-${season.number}`);

  let hasExpanded = $state(false);
  let isOpen = $state(false);
  let isFirstRun = true;

  $effect.pre(() => {
    const shouldSnap = isFirstRun;
    isFirstRun = false;

    if (!isExpanded) {
      isOpen = false;
      return;
    }

    if (untrack(() => hasExpanded) || shouldSnap) {
      hasExpanded = true;
      isOpen = true;
      return;
    }

    hasExpanded = true;

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        isOpen = isExpanded;
      });
    });

    return () => cancelAnimationFrame(frame);
  });
</script>

<div
  class="trakt-season-watch-row"
  data-season={season.number}
  class:is-expanded={isExpanded}
  class:is-started={isStarted}
>
  <button
    class="season-toggle"
    aria-expanded={isExpanded}
    aria-controls={contentId}
    aria-label={m.button_label_toggle_season_episodes({ season: label })}
    onclick={onToggle}
  >
    <span class="season-summary">
      <span class="season-heading">
        <span class="season-name bold ellipsis">{label}</span>
        <span class="season-status">
          {status}
          <span class="season-caret">
            <CaretRightIcon />
          </span>
        </span>
      </span>

      <WatchProgressLine
        progress={season.progress}
        tone={isExpanded && !season.isComplete ? "lit" : "muted"}
      />
    </span>
  </button>

  {#if hasExpanded}
    <div
      class="season-content"
      class:is-open={isOpen}
      id={contentId}
      inert={!isExpanded}
    >
      <div class="season-content-inner">
        <SeasonEpisodes
          {showSlug}
          {show}
          {upNextEpisodeId}
          watchedEpisodeIds={season.watchedEpisodeIds}
          episodeCount={season.total}
          remainingCount={season.aired - season.watched}
          season={season.number}
          seasonLabel={label}
        />
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-season-watch-row {
    padding: var(--ni-12);
    border-radius: var(--border-radius-l);

    background-color: var(--color-watch-state-quiet);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      var(--color-watch-state-quiet-ring);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, box-shadow, border-radius;

    &.is-expanded {
      border-radius: var(--border-radius-xl);

      background-color: var(--color-watch-state-glass);
      backdrop-filter: blur(var(--ni-20));
      box-shadow:
        inset 0 var(--ni-1) 0 var(--color-watch-state-glass-edge),
        inset 0 0 0 var(--border-thickness-xxs)
          var(--color-watch-state-glass-ring),
        var(--shadow-watch-state-glass);
    }
  }

  .season-toggle {
    all: unset;
    box-sizing: border-box;

    width: 100%;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    @include for-mouse {
      &:hover .season-status {
        color: var(--color-text-primary);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-4);
      border-radius: var(--border-radius-m);
    }
  }

  .season-content {
    display: grid;
    grid-template-rows: 0fr;

    transition: grid-template-rows var(--transition-duration-short)
      cubic-bezier(0.22, 1, 0.36, 1);

    &.is-open {
      grid-template-rows: 1fr;
    }
  }

  .season-content-inner {
    min-height: 0;
    overflow: hidden;
  }

  .season-summary {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .season-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .season-name {
    min-width: 0;
  }

  .season-status {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;
    color: var(--color-text-secondary);

    transition: color var(--transition-increment) ease-in-out;
  }

  .season-caret {
    display: flex;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);

      transition: rotate var(--transition-duration-short) ease-out;
    }

    .is-expanded & :global(svg) {
      rotate: 90deg;
    }

    .is-expanded &:dir(rtl) :global(svg) {
      rotate: -90deg;
    }
  }
</style>
