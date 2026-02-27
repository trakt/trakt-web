<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import Link from "../link/Link.svelte";

  type SummaryPosterProps = {
    src: string;
    alt: string;
    href?: string | Nil;
    target?: "_blank" | "_self" | "_parent" | "_top";
    hoverOverlay?: Snippet;
    actions?: Snippet;
    tags?: Snippet;
    variant?: "portrait" | "landscape";
  };

  const {
    src,
    alt,
    href,
    actions,
    hoverOverlay,
    target = "_blank",
    tags,
    variant = "portrait",
  }: SummaryPosterProps = $props();

  const activeOverlay = $derived(href && hoverOverlay);
</script>

<div class="trakt-summary-poster-container" data-variant={variant}>
  <div class="trakt-summary-poster" class:has-active-overlay={activeOverlay}>
    <Link {href} {target}>
      <CrossOriginImage {src} {alt} />
    </Link>
  </div>

  {#if activeOverlay}
    <div class="trakt-summary-poster-overlay">
      {@render activeOverlay()}
    </div>
  {/if}

  {@render actions?.()}

  {#if tags}
    <div class="trakt-summary-poster-tags" transition:fade={{ duration: 150 }}>
      {@render tags()}
    </div>
  {/if}
</div>

<style>
  .trakt-summary-poster-container {
    --overlay-border-size: var(--ni-2);
    --poster-aspect-ratio: 2 / 3;

    width: var(--summary-poster-width);
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    position: relative;

    &[data-variant="landscape"] {
      .trakt-summary-poster :global(img),
      .trakt-summary-poster-overlay {
        --poster-aspect-ratio: 16 / 9;
      }
    }
  }

  .trakt-summary-poster :global(img),
  .trakt-summary-poster-overlay {
    overflow: hidden;
    border-radius: var(--border-radius-xxl);
  }

  .trakt-summary-poster {
    position: relative;

    :global(img) {
      display: block;

      width: var(--summary-poster-width);
      aspect-ratio: var(--poster-aspect-ratio);

      object-fit: cover;

      align-self: stretch;

      box-shadow: var(--shadow-raised);
      box-sizing: border-box;

      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, border, opacity;
    }
  }

  .trakt-summary-poster-overlay {
    position: absolute;
    z-index: var(--layer-raised);

    --border-size: calc(2 * var(--overlay-border-size));
    inset: 0;
    margin: auto;
    width: calc(100% - var(--border-size));
    height: calc(100% - var(--border-size));

    opacity: 0;
    transition: opacity var(--transition-increment) ease-in-out;

    pointer-events: none;

    box-sizing: border-box;
    border: var(--overlay-border-size) solid var(--color-overlay-foreground);
  }

  .has-active-overlay:hover {
    :global(img) {
      filter: saturate(30%);
      border: var(--overlay-border-size) solid transparent;
    }

    + .trakt-summary-poster-overlay {
      opacity: 1;
    }
  }

  .trakt-summary-poster-tags {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    position: absolute;
    z-index: var(--layer-raised);

    bottom: 0;
    left: 0;
    right: 0;

    transform: translateY(50%);
  }
</style>
