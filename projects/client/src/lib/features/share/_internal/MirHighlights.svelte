<svelte:options css="injected" />

<script lang="ts">
  import type { ShareType } from "../models/ShareType.ts";

  type MirHighlight = {
    key: string;
    label: string;
    title: string;
    posterUrl: string;
    isFeatured: boolean;
  };

  const {
    highlights,
    variant,
  }: { highlights: ReadonlyArray<MirHighlight>; variant: ShareType } = $props();

  const posterAspectRatio = 750 / 500;

  const toPosterWidth = (isFeatured: boolean) => {
    if (variant === "story") {
      return isFeatured ? 320 : 244;
    }

    return isFeatured ? 350 : 276;
  };
</script>

<div class="trakt-mir-highlights">
  {#each highlights as highlight (highlight.key)}
    {@const width = toPosterWidth(highlight.isFeatured)}
    <div class="mir-highlight" style="width: {width}px;">
      <img
        class="mir-highlight-poster"
        src={highlight.posterUrl}
        alt=""
        style="width: {width}px; height: {width * posterAspectRatio}px;"
      />
      <span class="mir-highlight-label">{highlight.label}</span>
      <b class="mir-highlight-title" class:is-featured={highlight.isFeatured}>
        {highlight.title}
      </b>
    </div>
  {/each}
</div>

<style>
  .trakt-mir-highlights {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 28px;
  }

  .mir-highlight {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    color: #efefef;
  }

  .mir-highlight-poster {
    border-radius: 12px;
  }

  .mir-highlight-label {
    font-size: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(239, 239, 239, 0.6);
  }

  .mir-highlight-title {
    max-width: 100%;

    font-size: 26px;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mir-highlight-title.is-featured {
    font-size: 32px;
  }
</style>
