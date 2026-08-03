<script lang="ts">
  import PauseIcon from "$lib/components/icons/PauseIcon.svelte";
  import PlayArrowIcon from "$lib/components/icons/PlayArrowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SoundtrackTrack } from "$lib/requests/models/SoundtrackTrack";

  const {
    track,
    isPlaying,
    isSelected = false,
    onPlay,
  }: {
    track: SoundtrackTrack;
    isPlaying: boolean;
    isSelected?: boolean;
    onPlay: (track: SoundtrackTrack) => void;
  } = $props();

  const isPlayable = $derived(Boolean(track.spotifyId));
</script>

<li
  class="trakt-soundtrack-row"
  class:is-muted={!isPlayable}
  class:is-playing={isSelected}
>
  <span class="row-position">{track.position + 1}</span>

  <span class="row-title ellipsis" class:bold={isPlayable}>{track.title}</span>

  {#if track.performer}
    <span class="row-performer tag secondary ellipsis">{track.performer}</span>
  {/if}

  {#if isPlayable}
    <button
      class="row-action"
      type="button"
      aria-label={isPlaying
        ? m.button_label_pause_track({ title: track.title })
        : m.button_label_play_track({ title: track.title })}
      onclick={() => onPlay(track)}
    >
      {#if isPlaying}
        <PauseIcon />
      {:else}
        <PlayArrowIcon />
      {/if}
    </button>
  {:else}
    <span class="row-unmatched" aria-label={m.text_soundtrack_unmatched()}>
      &mdash;
    </span>
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-soundtrack-row {
    display: flex;
    gap: var(--ni-12);
    align-items: center;

    box-sizing: border-box;
    height: var(--height-soundtrack-row);
    padding-inline: var(--ni-12);

    &:not(:first-child) {
      border-block-start: 1px solid var(--color-border);
    }

    &.is-playing {
      background-color: var(--color-soundtrack-row-active-background);
    }

    &.is-muted {
      .row-title {
        color: var(--color-text-secondary);
      }
    }
  }

  .row-position {
    flex: none;
    min-width: 2ch;

    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
    font-variant-numeric: tabular-nums;
    text-align: end;
  }

  .row-title {
    flex: 1;
    min-width: 0;
  }

  .row-performer {
    flex: none;
    max-width: 40%;
    margin-inline-start: auto;
  }

  .row-action {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    width: var(--ni-28);
    height: var(--ni-28);
    padding: 0;

    color: var(--color-soundtrack-play-foreground);

    background-color: var(--color-soundtrack-play-background);
    border: none;
    border-radius: 50%;

    cursor: pointer;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .row-unmatched {
    flex: none;

    width: var(--ni-28);

    color: var(--color-text-secondary);
    text-align: center;
  }

  @include for-mobile {
    .row-performer {
      display: none;
    }
  }
</style>
