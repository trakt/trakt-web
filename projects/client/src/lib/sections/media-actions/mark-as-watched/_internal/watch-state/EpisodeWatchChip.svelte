<script lang="ts">
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { useMarkAsWatched } from "../../useMarkAsWatched.ts";
  import { markAsWatchedDrawerStore } from "../markAsWatchedDrawerStore.ts";

  const {
    episode,
    show,
    isUpNext = false,
  }: {
    episode: EpisodeEntry;
    show: { id: number; title: string };
    isUpNext?: boolean;
  } = $props();

  const {
    isWatched,
    isWatchable,
    isMarkingAsWatched,
    isQueued,
    removeWatched,
  } = $derived(useMarkAsWatched({ type: "episode", media: episode, show }));

  const { confirm } = useConfirm();

  const title = $derived(
    `${show.title} ${episodeNumberLabel({
      seasonNumber: episode.season,
      episodeNumber: episode.number,
    })}`,
  );

  const confirmRemoveWatched = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title,
      onConfirm: removeWatched,
    }),
  );

  const isFuture = $derived(episode.effectiveReleaseDate > new Date());

  const state = $derived.by(() => {
    if ($isWatched) return "watched";
    if (isFuture || !isWatchable) return "upcoming";

    return "unwatched";
  });

  const label = $derived.by(() => {
    switch (state) {
      case "watched":
        return m.text_episode_watch_state_watched({ number: episode.number });
      case "unwatched":
        return m.text_episode_watch_state_unwatched({ number: episode.number });
      case "upcoming":
        return m.text_episode_watch_state_upcoming({ number: episode.number });
    }
  });

  const handler = (event: MouseEvent) => {
    if ($isWatched) {
      confirmRemoveWatched(event);
      return;
    }

    markAsWatchedDrawerStore.open({
      title,
      mediaStore: { type: "episode", media: episode, show },
      elevated: true,
    });
  };
</script>

<button
  class="trakt-episode-watch-chip"
  data-state={state}
  class:is-busy={$isMarkingAsWatched || $isQueued}
  class:is-up-next={isUpNext && state === "unwatched"}
  aria-label={label}
  aria-pressed={$isWatched}
  title={episode.title}
  disabled={state === "upcoming" || $isMarkingAsWatched || $isQueued}
  onclick={handler}
>
  <span class="chip-circle">
    {#if state === "watched"}
      <TrackIcon state="watched" />
    {:else}
      <TrackIcon state="unwatched" size="small" />
    {/if}
  </span>
  <span class="chip-number tag bold">{episode.number}</span>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-episode-watch-chip {
    all: unset;

    min-height: var(--ni-44);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-4);

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible .chip-circle {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }

    &:active:not([disabled]) .chip-circle {
      scale: 0.92;
    }

    &[data-state="upcoming"] {
      cursor: default;
      opacity: 0.5;
    }

    &.is-busy {
      cursor: progress;
      opacity: 0.5;
    }
  }

  .chip-circle {
    width: var(--ni-28);
    height: var(--ni-28);
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    color: var(--color-foreground);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-foreground);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color, box-shadow, scale;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    [data-state="watched"] > & {
      background-color: var(--color-background-indicator-tag);
      color: var(--color-text-indicator-tag);
      box-shadow: none;
    }

    .is-up-next > & {
      box-shadow: inset 0 0 0 var(--border-thickness-xs)
        var(--color-watch-state-up-next);
    }

    [data-state="upcoming"] > & {
      color: var(--color-text-secondary);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-text-secondary);
    }
  }

  .chip-number {
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);

    [data-state="upcoming"] > & {
      color: var(--color-text-secondary);
    }
  }

  @include for-mouse {
    .trakt-episode-watch-chip[data-state="unwatched"]:hover:not([disabled])
      .chip-circle {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 12%,
        transparent
      );
    }

    .trakt-episode-watch-chip[data-state="watched"]:hover:not([disabled])
      .chip-circle {
      opacity: 0.8;
    }
  }
</style>
