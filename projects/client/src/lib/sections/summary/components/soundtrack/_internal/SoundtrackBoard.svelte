<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { SoundtrackTrack } from "$lib/requests/models/SoundtrackTrack";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import SoundtrackPanel from "./SoundtrackPanel.svelte";
  import SoundtrackTrackRow from "./SoundtrackTrackRow.svelte";
  import type { SoundtrackSummary } from "./toSoundtrackSummary.ts";

  // The player needs more height than a short tracklist provides, so the split
  // board is floored at this many rows rather than dropping the player.
  const panelMinimumRows = 5;
  // A show aggregates every episode, so this list runs to several hundred
  // rows. Reveal it in chunks as the reader reaches the end of one.
  const chunkSize = 50;

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
  let revealedCount = $state(chunkSize);

  const visibleTracks = $derived(tracks.slice(0, revealedCount));
  const hasHiddenTracks = $derived(revealedCount < tracks.length);

  function revealNextChunk() {
    revealedCount = Math.min(revealedCount + chunkSize, tracks.length);
  }

  // Only the rows on screen are clickable, so a match further down the full
  // list does not earn a player.
  const hasPlayableRow = $derived(
    tracks.some((track) => Boolean(track.spotifyId)),
  );
  const selected = $derived(
    tracks.find((track) => track.key === selectedKey) ?? null,
  );

  function onPlay(track: SoundtrackTrack) {
    selectedKey = track.key;
    playToken += 1;

    // `matchedOn` rides the play event instead of the row: it measures our
    // matcher, not the music, so it is a QA signal rather than a label.
    trackEvent({
      source,
      position: track.position,
      matched_on: track.matchedOn ?? "unknown",
    });
  }
</script>

<div
  class="trakt-soundtrack-board"
  class:has-player={hasPlayableRow}
  data-layout={layout}
  style="--rows-shown: {visibleTracks.length}; --min-rows: {panelMinimumRows}"
>
  {#if hasPlayableRow}
    <SoundtrackPanel
      {media}
      credit={summary.credit}
      total={summary.total}
      playable={summary.playable}
      track={selected}
      {playToken}
      {layout}
      onPlayingChange={(value) => (isPlaying = value)}
    />
  {/if}

  <ul class="board-list">
    {#each visibleTracks as track (track.key)}
      <SoundtrackTrackRow
        {track}
        isPlaying={isPlaying && selectedKey === track.key}
        isSelected={selectedKey === track.key}
        {onPlay}
      />
    {/each}
  </ul>

  {#if hasHiddenTracks}
    <!-- Outside the list so the list box stays exactly as tall as its rows,
         and keyed so each chunk gets a fresh element: `whenInViewport` is
         one-shot and stops observing after it fires. -->
    {#key revealedCount}
      <div class="board-sentinel" use:whenInViewport={revealNextChunk}></div>
    {/key}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /* Flex rather than grid so the sticky panel's containing block is the whole
     board: a sticky grid item cannot leave its own row. */
  .trakt-soundtrack-board {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .board-sentinel {
    flex: none;
    height: 1px;
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

  /* Side by side, and only here: one token sizes both columns so the list and
     the player beside it can never disagree on height. */
  .trakt-soundtrack-board[data-layout="split"] {
    @include for-desktop {
      display: grid;
      grid-auto-rows: auto;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-12);
      align-items: stretch;

      height: calc(
        max(var(--rows-shown), var(--min-rows)) * var(--height-soundtrack-row)
      );

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
