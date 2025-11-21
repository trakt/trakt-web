<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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
  };

  const {
    src,
    alt,
    href,
    actions,
    hoverOverlay,
    target = "_blank",
    tags,
  }: SummaryPosterProps = $props();

  const activeOverlay = $derived(href && hoverOverlay);
</script>

<div class="trakt-summary-poster-container">
  <div class="trakt-summary-poster" class:has-active-overlay={activeOverlay}>
    <Link {href} {target}>
      <CrossOriginImage {src} {alt} />
    </Link>
  </div>

  {#if activeOverlay}
    <RenderFor audience="all">
      <div class="trakt-summary-poster-overlay">
        {@render activeOverlay()}
      </div>
    </RenderFor>
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

    width: var(--ni-320);
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    position: relative;
  }

  .trakt-summary-poster :global(img),
  .trakt-summary-poster-overlay {
    overflow: hidden;

    border-radius: var(--border-radius-xxl);

    width: var(--ni-320);
    height: var(--ni-480);

    object-fit: cover;
  }

  .trakt-summary-poster {
    :global(img) {
      align-self: stretch;

      box-shadow: 0px 7.673px 23.02px 0px rgba(0, 0, 0, 0.56);
      box-sizing: border-box;

      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, border, opacity;
    }
  }

  .trakt-summary-poster-overlay {
    position: absolute;
    box-sizing: border-box;

    opacity: 0;
    transition: opacity var(--transition-increment) ease-in-out;

    pointer-events: none;

    border: var(--overlay-border-size) solid var(--color-overlay-foreground);
  }

  .has-active-overlay:hover {
    :global(img) {
      filter: saturate(30%);
      border: var(--overlay-border-size) solid transparent;
    }

    & + .trakt-summary-poster-overlay {
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
