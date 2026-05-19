<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import FeedContent from "./_internal/FeedContent.svelte";
  import { getBackgroundGradient } from "./_internal/getBackgroundGradient.ts";
  import OpenGraphContent from "./_internal/OpenGraphContent.svelte";
  import Poster from "./_internal/Poster.svelte";
  import StoryContent from "./_internal/StoryContent.svelte";
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

  const backdropHeight = $derived(height * 0.8);
  const backdropWidth = $derived(width * 0.75);

  const logoStyle = $derived.by(() => {
    if (variant !== "story") {
      return `top: ${padding}px; right: ${padding}px;`;
    }

    const logoWidth = 264;
    const logoHeight = 64;

    const belowBackdrop = height - backdropHeight;
    const top = backdropHeight + (belowBackdrop - logoHeight) / 2;
    const left = (width - logoWidth) / 2;
    return `top: ${top}px; left: ${left}px; width: ${logoWidth}px; height: ${logoHeight}px;`;
  });
</script>

<div
  class="trakt-share-card"
  style="width: {width}px; height: {height}px; padding: {padding}px; background: linear-gradient(90deg, {gradientStart} 0%, {gradientEnd} 100%);"
  data-variant={variant}
>
  {#if variant === "story"}
    <div
      class="trakt-share-card-backdrop"
      style="height: {backdropHeight}px; width: {backdropWidth}px;"
    ></div>
  {/if}

  <div class="trakt-share-card-background" style="color: {logoColor};">
    <TraktLogoLarge />
  </div>
  <div class="trakt-share-card-logo" style={logoStyle}>
    <TraktLogoText />
  </div>

  <Poster {posterUrl} {variant} />

  {#if variant === "open-graph"}
    <OpenGraphContent {media} {crew} {ratings} />
  {/if}

  {#if variant === "feed"}
    <FeedContent {media} {crew} {ratings} />
  {/if}

  {#if variant === "story"}
    <StoryContent {media} {crew} {ratings} />
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
    border-radius: 16px;

    :global(svg) {
      height: 100%;
      width: 100%;
      overflow: visible;

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
      width: 100%;
      height: 200%;

      top: -50%;
      right: -30%;
    }

    .trakt-share-card-logo {
      width: 175px;
      height: 42px;
    }
  }

  .trakt-share-card[data-variant="story"] {
    .trakt-share-card-background {
      width: 200%;
      height: 100%;

      bottom: -5%;
      left: -55%;
    }
  }

  .trakt-share-card[data-variant="feed"] {
    .trakt-share-card-background {
      width: 100%;
      height: 100%;

      left: -25%;
    }

    .trakt-share-card-logo {
      width: 175px;
      height: 42px;
    }
  }

  .trakt-share-card[data-variant="feed"],
  .trakt-share-card[data-variant="story"] {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .trakt-share-card-backdrop {
    display: flex;

    position: absolute;
    top: 0;

    background: linear-gradient(180deg, #737373 0%, #d9d9d9 100%);
    opacity: 0.15;

    border-bottom-left-radius: 48px;
    border-bottom-right-radius: 48px;
  }
</style>
