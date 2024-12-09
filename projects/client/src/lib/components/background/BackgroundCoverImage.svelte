<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { writable } from "svelte/store";

  type ImageBackgroundProps = {
    src: string;
    type: MediaType | "main";
  };

  const color = writable("var(--shade-900)");

  function extractDominantColor(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCount = data.reduce(
      (acc, _, i) => {
        if (i % 4 === 0) {
          const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
          acc[rgb] = (acc[rgb] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const dominantColor = Object.keys(colorCount).reduce((a, b) =>
      colorCount[a] > colorCount[b] ? a : b,
    );

    return `rgb(${dominantColor})`;
  }

  const { src, type }: ImageBackgroundProps = $props();
</script>

<svelte:head>
  <meta name="theme-color" content={$color} />
</svelte:head>

<div class="background-cover-image">
  <CrossOriginImage
    {src}
    alt={`Background for ${type}`}
    onload={function (ev) {
      if (ev.target instanceof HTMLImageElement) {
        const dominantColor = extractDominantColor(ev.target);

        if (dominantColor == null) return;

        color.set(dominantColor);
      }
    }}
  />
</div>

<style>
  .background-cover-image {
    z-index: -1;
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    top: 0;
    left: 0;
    width: 100%;
    background: var(--shade-900);

    :global(img) {
      width: 100%;
      height: 100%;
      position: relative;
    }

    &::after {
      content: "";
      width: 100%;
      height: 100%;

      position: absolute;
      bottom: 0;
      left: 0;

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background) 64%, transparent 36%) 0%,
        color-mix(in srgb, var(--color-background) 65%, transparent 35%) 5%,
        color-mix(in srgb, var(--color-background) 66%, transparent 34%) 9%,
        color-mix(in srgb, var(--color-background) 67%, transparent 33%) 13%,
        color-mix(in srgb, var(--color-background) 68%, transparent 32%) 17%,
        color-mix(in srgb, var(--color-background) 69%, transparent 31%) 20%,
        color-mix(in srgb, var(--color-background) 70%, transparent 30%) 25%,
        color-mix(in srgb, var(--color-background) 72%, transparent 28%) 29%,
        color-mix(in srgb, var(--color-background) 74%, transparent 26%) 34%,
        color-mix(in srgb, var(--color-background) 77%, transparent 23%) 40%,
        color-mix(in srgb, var(--color-background) 79%, transparent 21%) 46%,
        color-mix(in srgb, var(--color-background) 83%, transparent 17%) 55%,
        color-mix(in srgb, var(--color-background) 86%, transparent 14%) 64%,
        color-mix(in srgb, var(--color-background) 90%, transparent 10%) 74%,
        color-mix(in srgb, var(--color-background) 95%, transparent 5%) 85%,
        var(--color-background) 100%
      );

      pointer-events: none;
    }
  }
</style>
