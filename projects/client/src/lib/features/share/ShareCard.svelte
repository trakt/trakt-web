<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import { getBackgroundGradient } from "./_internal/getBackgroundGradient.ts";
  import OpenGraphContent from "./_internal/OpenGraphContent.svelte";
  import Poster from "./_internal/Poster.svelte";
  import TraktLogoLarge from "./assets/TraktLogoLarge.svelte";
  import TraktLogoText from "./assets/TraktLogoText.svelte";
  import { SHARE_TYPE_DIMENSIONS, type ShareType } from "./models/ShareType.ts";

  const defaultLogoColor = "#00588c";

  type ShareCardProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
    posterUrl: string;
    variant: ShareType;
  };

  const { media, crew, ratings, posterUrl, variant }: ShareCardProps = $props();

  const { width, height, padding } = $derived(SHARE_TYPE_DIMENSIONS[variant]);

  const { gradientStart, gradientEnd } = $derived(getBackgroundGradient(media));

  const logoColor = $derived.by(() => {
    const color = media.colors?.at(0);
    if (Boolean(color) && color !== "transparent") {
      return color;
    }

    return defaultLogoColor;
  });
</script>

<div
  class="trakt-share-card"
  style="width: {width}px; height: {height}px; padding: {padding}px; background: linear-gradient(90deg, {gradientStart} 0%, {gradientEnd} 100%);"
  data-variant={variant}
>
  <div
    class="trakt-share-card-background"
    style="width: {height}px; color: {logoColor};"
  >
    <TraktLogoLarge />
  </div>
  <div
    class="trakt-share-card-logo"
    style="top: {padding}px; right: {padding}px;"
  >
    <TraktLogoText />
  </div>

  <Poster {posterUrl} {variant} />

  {#if variant === "open-graph"}
    <OpenGraphContent {media} {crew} {ratings} />
  {/if}
</div>

<style>
  .trakt-share-card {
    position: relative;

    display: flex;
    border-radius: 16px;
    overflow: hidden;

    box-sizing: border-box;
  }

  .trakt-share-card-background,
  .trakt-share-card-logo {
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .trakt-share-card-background {
    :global(svg) {
      height: 100%;
      width: 100%;

      opacity: 0.1;
    }
  }

  .trakt-share-card-logo {
    :global(svg) {
      height: 100%;
      width: 100%;

      color: #efefef;
    }
  }

  .trakt-share-card[data-variant="open-graph"] {
    .trakt-share-card-background {
      border-radius: 16px;

      top: 0;
      right: 0;
      bottom: 0;
    }

    .trakt-share-card-logo {
      width: 175px;
      height: 42px;
    }
  }
</style>
