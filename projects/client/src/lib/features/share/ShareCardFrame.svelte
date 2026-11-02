<svelte:options css="injected" />

<script lang="ts">
  import { hexToRgba } from "$lib/utils/color/hexToRgba.ts";
  import { getBackgroundGradient } from "./_internal/getBackgroundGradient.ts";
  import { getWatermarkPlacement } from "./_internal/getWatermarkPlacement.ts";
  import TraktLogoLarge from "./assets/TraktLogoLarge.svelte";
  import TraktLogoText from "./assets/TraktLogoText.svelte";
  import { SHARE_TYPE_DIMENSIONS } from "./models/ShareType.ts";
  import type { ShareCardFrameProps } from "./ShareCardFrameProps.ts";

  const defaultLogoColor = "#00588c";
  const watermarkAlpha = 0.1;
  const defaultWatermarkFill =
    hexToRgba(defaultLogoColor, watermarkAlpha) ?? defaultLogoColor;

  const {
    variant,
    colors,
    backdropWidthRatio = 0.75,
    backdrop,
    hasWatermark = true,
    children,
  }: ShareCardFrameProps = $props();

  const { width, height, padding } = $derived(SHARE_TYPE_DIMENSIONS[variant]);

  const { gradientStart, gradientEnd } = $derived(
    getBackgroundGradient({ colors }),
  );

  const watermark = $derived(getWatermarkPlacement(variant));

  const logoColor = $derived.by(() => {
    const color = colors?.at(0);
    if (color && color !== "transparent") {
      return color;
    }

    return defaultLogoColor;
  });

  const watermarkFill = $derived(
    hexToRgba(logoColor, watermarkAlpha) ?? defaultWatermarkFill,
  );

  const backdropHeight = $derived(height * 0.8);
  const backdropWidth = $derived(width * backdropWidthRatio);

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
  class="trakt-share-card-frame"
  style="width: {width}px; height: {height}px; padding: {padding}px; background: linear-gradient(90deg, {gradientStart} 0%, {gradientEnd} 100%);"
  data-variant={variant}
>
  {@render backdrop?.()}

  {#if variant === "story"}
    <div
      class="share-card-backdrop"
      style="height: {backdropHeight}px; width: {backdropWidth}px;"
    ></div>
  {/if}

  {#if hasWatermark}
    <div class="share-card-background" style={watermark.style}>
      <TraktLogoLarge viewBox={watermark.viewBox} fill={watermarkFill} />
    </div>
  {/if}
  <div class="share-card-logo" style={logoStyle}>
    <TraktLogoText />
  </div>

  {@render children()}
</div>

<style>
  .trakt-share-card-frame {
    position: relative;

    display: flex;

    box-sizing: border-box;
  }

  .share-card-background,
  .share-card-logo {
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .share-card-background {
    border-radius: 16px;
  }

  .share-card-background :global(svg) {
    height: 100%;
    width: 100%;
    overflow: visible;
  }

  .share-card-logo :global(svg) {
    height: 100%;
    width: 100%;

    color: #efefef;
  }

  .trakt-share-card-frame[data-variant="open-graph"] .share-card-logo,
  .trakt-share-card-frame[data-variant="feed"] .share-card-logo {
    width: 175px;
    height: 42px;
  }

  .trakt-share-card-frame[data-variant="feed"],
  .trakt-share-card-frame[data-variant="story"] {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .share-card-backdrop {
    display: flex;

    position: absolute;
    top: 0;

    background: linear-gradient(180deg, #737373 0%, #d9d9d9 100%);
    opacity: 0.15;

    border-bottom-left-radius: 48px;
    border-bottom-right-radius: 48px;
  }
</style>
