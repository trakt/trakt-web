<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import FeedContent from "./_internal/FeedContent.svelte";
  import { getBackgroundGradient } from "./_internal/getBackgroundGradient.ts";
  import { getWatermarkPlacement } from "./_internal/getWatermarkPlacement.ts";
  import { hexToRgba } from "$lib/utils/color/hexToRgba.ts";
  import OpenGraphContent from "./_internal/OpenGraphContent.svelte";
  import Poster from "./_internal/Poster.svelte";
  import StoryContent from "./_internal/StoryContent.svelte";
  import TraktLogoLarge from "./assets/TraktLogoLarge.svelte";
  import TraktLogoText from "./assets/TraktLogoText.svelte";
  import { SHARE_TYPE_DIMENSIONS, type ShareType } from "./models/ShareType.ts";

  const defaultLogoColor = "#00588c";
  const watermarkAlpha = 0.1;
  const defaultWatermarkFill = hexToRgba(defaultLogoColor, watermarkAlpha) ??
    defaultLogoColor;

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

  const watermark = $derived(getWatermarkPlacement(variant));

  const logoColor = $derived.by(() => {
    const color = media.colors?.at(0);
    if (color && color !== "transparent") {
      return color;
    }

    return defaultLogoColor;
  });

  const watermarkFill = $derived(
    hexToRgba(logoColor, watermarkAlpha) ?? defaultWatermarkFill,
  );

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

  <div
    class="trakt-share-card-background"
    style={watermark.style}
  >
    <TraktLogoLarge viewBox={watermark.viewBox} fill={watermarkFill} />
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
  }

  .trakt-share-card-background :global(svg) {
    height: 100%;
    width: 100%;
    overflow: visible;
  }

  .trakt-share-card-logo :global(svg) {
    height: 100%;
    width: 100%;

    color: #efefef;
  }

  .trakt-share-card[data-variant="open-graph"] .trakt-share-card-logo,
  .trakt-share-card[data-variant="feed"] .trakt-share-card-logo {
    width: 175px;
    height: 42px;
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
