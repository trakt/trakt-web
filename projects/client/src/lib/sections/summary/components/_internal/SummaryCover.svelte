<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    type,
    src,
    colors,
  }: { type: MediaType; src: string; colors?: [string, string] } = $props();
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <CoverImageSetter {src} {colors} {type} />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <CoverImageSetter src={null} {type} />

  <div
    class="trakt-media-summary-spotlight-gradient"
    style="--trakt-cover-primary-color: {colors?.at(0) ??
      'var(--color-background-purple)'};"
  ></div>
</RenderFor>

<style>
  .trakt-media-summary-spotlight-gradient {
    z-index: var(--layer-background);
    position: absolute;
    overflow: hidden;

    left: 0;
    top: 0;
    width: var(--ni-920);
    height: var(--ni-920);

    opacity: 0.35;

    background: radial-gradient(
      circle at top left,
      var(--trakt-cover-primary-color) 0%,
      color-mix(in srgb, var(--trakt-cover-primary-color) 80%, transparent) 20%,
      transparent 70%
    );
  }
</style>
