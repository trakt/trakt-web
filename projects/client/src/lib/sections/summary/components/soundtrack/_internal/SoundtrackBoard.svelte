<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { SoundtrackTrack } from "$lib/requests/models/SoundtrackTrack";
  import SoundtrackPanel from "./SoundtrackPanel.svelte";
  import SoundtrackTrackRow from "./SoundtrackTrackRow.svelte";
  import type { SoundtrackSummary } from "./toSoundtrackSummary.ts";

  // Below this the list is too short to sit beside a player without the two
  // columns disagreeing on height, so the panel becomes a bar instead.
  const minimumSplitRows = 5;

  const {
    media,
    tracks,
    summary,
    source,
    layout = "split",
  }: {
    media: MediaEntry;
    tracks: ReadonlyArray<SoundtrackTrack>;
    // Describes the whole soundtrack, not the rows on screen - the page only
    // lists the first few, and a count of those would read as the total.
    summary: SoundtrackSummary;
    source: string;
    layout?: "split" | "stacked";
  } = $props();

  const { track: trackEvent } = useTrack(AnalyticsEvent.Soundtrack);

  let selectedKey = $state<string | null>(null);
  let playToken = $state(0);
  let isPlaying = $state(false);

  // Only the rows on screen are clickable, so a match further down the full
  // list does not earn a player.
  const hasPlayableRow = $derived(
    tracks.some((track) => Boolean(track.spotifyId)),
  );
  const selected = $derived(
    tracks.find((track) => track.key === selectedKey) ?? null,
  );
  const effectiveLayout = $derived(
    layout === "split" && tracks.length >= minimumSplitRows
      ? "split"
      : "stacked",
  );

  function onPlay(track: SoundtrackTrack) {
    selectedKey = track.key;
    playToken += 1;

    // `matchedOn` rides the play event instead of the row: it measures our
    // matcher, not the music, so it is a QA signal rather than a label.
    trackEvent({
      source,
      position: track.position,
      matched_on: track.matchedOn ?? "credit",
    });
  }
</script>

<div
  class="trakt-soundtrack-board"
  class:has-player={hasPlayableRow}
  data-layout={effectiveLayout}
  style="--rows-shown: {tracks.length}"
>
  {#if hasPlayableRow}
    <SoundtrackPanel
      {media}
      credit={summary.credit}
      total={summary.total}
      playable={summary.playable}
      track={selected}
      {playToken}
      layout={effectiveLayout}
      onPlayingChange={(value) => (isPlaying = value)}
    />
  {/if}

  <ul class="board-list">
    {#each tracks as track (track.key)}
      <SoundtrackTrackRow
        {track}
        isPlaying={isPlaying && selectedKey === track.key}
        isSelected={selectedKey === track.key}
        {onPlay}
      />
    {/each}
  </ul>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /* One token sizes both columns: the row count drives the list height and the
     panel stretches to it, so the two never disagree. */
  .trakt-soundtrack-board {
    display: grid;
    grid-auto-rows: min-content;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-8);
  }

  .board-list {
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    height: calc(var(--rows-shown) * var(--height-soundtrack-row));
    margin: 0;
    padding: 0;
    overflow: hidden;

    list-style: none;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);
    /* Same lift every card gets - without it the surface is invisible against
       the light-theme page. */
    box-shadow: var(--shadow-base);
  }

  .trakt-soundtrack-board[data-layout="split"] {
    @include for-desktop {
      grid-auto-rows: auto;
      gap: var(--ni-12);
      align-items: stretch;

      height: calc(var(--rows-shown) * var(--height-soundtrack-row));

      /* Nothing resolved: the panel is dropped and the credit list runs the
         full width. */
      &.has-player {
        grid-template-columns: var(--width-soundtrack-panel) minmax(0, 1fr);
      }

      .board-list {
        height: 100%;
      }
    }
  }
</style>
