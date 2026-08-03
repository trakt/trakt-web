<script lang="ts">
  import SpotifyIcon from "$lib/components/icons/SpotifyIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { SoundtrackTrack } from "$lib/requests/models/SoundtrackTrack";
  import { fade } from "svelte/transition";
  import {
    loadSpotifyIframeApi,
    type SpotifyEmbedController,
  } from "./loadSpotifyIframeApi.ts";

  const {
    media,
    credit,
    total,
    playable,
    track,
    playToken,
    layout,
    onPlayingChange,
  }: {
    media: MediaEntry;
    credit: string | null;
    total: number;
    playable: number;
    track: SoundtrackTrack | null;
    // Bumped on every row click so clicking the same row twice toggles
    // playback instead of being swallowed as "no change".
    playToken: number;
    layout: "split" | "stacked";
    onPlayingChange: (isPlaying: boolean) => void;
  } = $props();

  // Spotify's card reflows after it reports ready, on every load. Release the
  // skeleton anyway if playback never reports in.
  const settleTimeout = 2500;
  // `playback_update` still fires for the outgoing track, so the first one
  // after a switch cannot be trusted as "settled".
  const settleDwell = 400;

  let host = $state<HTMLDivElement>();
  let isEmbedVisible = $state(false);
  let controller: SpotifyEmbedController | null = null;
  let loadedUri: string | null = null;
  let requestedToken = -1;
  let settleTimer: ReturnType<typeof setTimeout> | null = null;
  let dwellTimer: ReturnType<typeof setTimeout> | null = null;
  let sawUpdateWhileDwelling = false;

  function clearTimers() {
    if (settleTimer != null) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }

    if (dwellTimer != null) {
      clearTimeout(dwellTimer);
      dwellTimer = null;
    }
  }

  function revealEmbed() {
    isEmbedVisible = true;
    clearTimers();
  }

  function coverEmbed() {
    isEmbedVisible = false;
    sawUpdateWhileDwelling = false;
    clearTimers();

    dwellTimer = setTimeout(() => {
      dwellTimer = null;

      if (sawUpdateWhileDwelling) {
        revealEmbed();
      }
    }, settleDwell);
    settleTimer = setTimeout(revealEmbed, settleTimeout);
  }

  function onPlaybackUpdate(isPaused: boolean) {
    if (dwellTimer != null) {
      sawUpdateWhileDwelling = true;
    } else {
      revealEmbed();
    }

    onPlayingChange(!isPaused);
  }

  const embedHeight = $derived(layout === "split" ? "152" : "80");
  const uri = $derived(
    track?.spotifyId ? `spotify:track:${track.spotifyId}` : null,
  );
  const playableRatio = $derived(
    m.text_soundtrack_playable_ratio({ playable, total }),
  );

  function attach(activeUri: string) {
    if (!host) {
      return;
    }

    loadSpotifyIframeApi().then((api) => {
      if (!host) {
        return;
      }

      api.createController(
        host,
        { uri: activeUri, width: "100%", height: embedHeight },
        (created) => {
          controller = created;
          loadedUri = activeUri;
          created.addListener("ready", () => created.play());
          created.addListener("playback_update", ({ data }) =>
            onPlaybackUpdate(data.isPaused),
          );
        },
      );
    });
  }

  $effect(() => {
    const activeUri = uri;
    const token = playToken;

    if (activeUri == null || token === requestedToken) {
      return;
    }

    requestedToken = token;

    if (controller == null) {
      coverEmbed();
      attach(activeUri);
      return;
    }

    // Same track: a toggle never reflows the card, so the embed stays visible.
    if (loadedUri === activeUri) {
      controller.togglePlay();
      return;
    }

    loadedUri = activeUri;
    coverEmbed();
    controller.loadUri(activeUri);
    controller.play();
  });

  $effect(() => () => {
    clearTimers();
    controller?.destroy();
  });
</script>

{#snippet spotifyGlyph()}
  <span class="media-glyph" aria-hidden="true"><SpotifyIcon /></span>
{/snippet}

{#snippet artwork()}
  <img
    class="media-artwork"
    src={media.cover.url.thumb}
    alt=""
    loading="lazy"
    decoding="async"
  />
{/snippet}

<div class="trakt-soundtrack-panel" data-layout={layout}>
  <!-- One box for every state, so nothing moves between them. The frame keeps
       its layout throughout: Spotify never reports ready for a display:none
       iframe. -->
  <div class="panel-media" style:--stage-height="{embedHeight}px">
    <div class="media-stage"><div bind:this={host}></div></div>

    {#if uri == null}
      <div class="media-overlay">
        {@render artwork()}
        <div class="overlay-copy">
          <p class="overlay-title bold ellipsis">{credit ?? media.title}</p>
          <p class="tag secondary">{playableRatio}</p>
        </div>
        {@render spotifyGlyph()}
      </div>
    {:else if !isEmbedVisible}
      <div class="media-overlay" out:fade={{ duration: 150 }}>
        {@render artwork()}
        <div class="overlay-copy overlay-lines">
          <Skeleton width="70%" height="var(--ni-12)" />
          <Skeleton width="45%" height="var(--ni-10)" />
          <Skeleton width="100%" height="var(--ni-4)" />
        </div>
        {@render spotifyGlyph()}
      </div>
    {/if}
  </div>

  {#if layout === "split"}
    <p class="panel-caption tag secondary ellipsis">
      {#if uri == null}
        {m.text_soundtrack_pick_a_track()}
      {:else}
        {credit ?? media.title} &middot; {playableRatio}
      {/if}
    </p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-soundtrack-panel {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    justify-content: space-between;

    box-sizing: border-box;
    height: 100%;
    padding: var(--ni-16);
    overflow: hidden;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);
  }

  .panel-media {
    position: relative;

    flex: none;

    height: var(--stage-height);

    border-radius: var(--border-radius-m);
  }

  .media-stage {
    height: 100%;

    :global(iframe) {
      display: block;

      width: 100%;

      border: none;
      border-radius: var(--border-radius-m);
    }
  }

  /* Mirrors the geometry of Spotify's own card: square art inset by the same
     gutter, copy beside it, glyph in the corner. */
  .media-overlay {
    position: absolute;
    inset: 0;

    display: flex;
    gap: var(--ni-12);
    align-items: center;

    box-sizing: border-box;
    padding: var(--ni-12);

    background-color: var(--color-background);
    border-radius: var(--border-radius-m);
  }

  .media-artwork {
    flex: none;
    aspect-ratio: 1;

    height: 100%;

    object-fit: cover;

    border-radius: var(--border-radius-s);
  }

  .overlay-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;

    :global(p) {
      margin: 0;
    }
  }

  .overlay-lines {
    gap: var(--ni-8);
  }

  .overlay-title {
    font-size: var(--font-size-text);
  }

  /* Matches the glyph Spotify draws inside its own 152px card, so the corner
     does not shift between the placeholder and the loaded embed. */
  .media-glyph {
    position: absolute;
    inset-block-start: var(--ni-10);
    inset-inline-end: var(--ni-10);

    display: inline-flex;

    width: var(--ni-28);
    height: var(--ni-28);

    color: var(--color-text-secondary);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .panel-caption {
    flex: none;
    margin: 0;
  }

  .trakt-soundtrack-panel[data-layout="stacked"] {
    height: var(--height-soundtrack-panel-compact);
    padding: 0;

    background-color: transparent;
    box-shadow: none;

    .media-overlay {
      background-color: var(--color-card-background);
    }

    /* The compact card draws a smaller glyph. */
    .media-glyph {
      inset-block-start: var(--ni-8);
      inset-inline-end: var(--ni-8);

      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  @include for-tablet-lg-and-below {
    .trakt-soundtrack-panel {
      position: sticky;
      inset-block-start: var(--ni-8);
      z-index: var(--layer-base);
    }
  }
</style>
