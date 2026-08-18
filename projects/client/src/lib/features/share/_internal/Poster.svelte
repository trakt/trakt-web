<svelte:options css="injected" />

<script lang="ts">
  import {
    SHARE_TYPE_DIMENSIONS,
    type ShareType,
  } from "../models/ShareType.ts";

  const { posterUrl, variant }: { posterUrl: string; variant: ShareType } =
    $props();

  const { height, padding } = $derived(SHARE_TYPE_DIMENSIONS[variant]);

  const posterAspectRatio = 350 / 232;

  const posterHeight = $derived.by(() => {
    switch (variant) {
      case "feed":
        return height / 1.25;
      case "story":
        return height / 1.75;
      case "open-graph":
        return height - padding * 2;
    }
  });

  const posterWidth = $derived(posterHeight / posterAspectRatio);
</script>

<div class="trakt-poster-container" style="width: {posterWidth}px;">
  <img
    src={posterUrl}
    class="trakt-share-poster"
    alt="poster"
    style="width: {posterWidth}px; height: {posterHeight}px;"
  />
</div>

<style>
  .trakt-poster-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .trakt-share-poster {
    border-radius: 12px;

    box-shadow: 0px 12px 32px 0px rgba(19, 21, 23, 0.22);
  }
</style>
