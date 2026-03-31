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

  const posterHeight = $derived(height - padding * 2);
  const posterWidth = $derived(posterHeight / posterAspectRatio);
</script>

<div class="trakt-poster-container" style="width: {posterWidth}px;">
  <img
    src={posterUrl}
    class="trakt-share-poster"
    alt="poster"
    width={posterWidth}
    height={posterHeight}
  />
</div>

<style>
  .trakt-poster-container {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
  }

  .trakt-share-poster {
    border-radius: 12px;

    box-shadow:
      0px 3.08px 7px 0px rgba(19, 21, 23, 0.16),
      0px 12.6px 12.6px 0px rgba(19, 21, 23, 0.14),
      0px 28.28px 16.8px 0px rgba(19, 21, 23, 0.08),
      0px 50.12px 20.16px 0px rgba(19, 21, 23, 0.02),
      0px 78.4px 21.84px 0px rgba(19, 21, 23, 0);
  }
</style>
