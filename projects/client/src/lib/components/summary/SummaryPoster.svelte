<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type SummaryPosterProps = {
    src: string;
    alt: string;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    hoverOverlay?: Snippet;
    actions?: Snippet;
  };

  const {
    src,
    alt,
    href,
    actions,
    hoverOverlay,
    target = "_blank",
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
    <div class="trakt-summary-poster-overlay">
      {@render activeOverlay()}
    </div>
  {/if}

  {@render actions?.()}
</div>

<style>
  .trakt-summary-poster-container {
    width: var(--ni-320);
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    position: relative;
  }

  .trakt-summary-poster :global(img),
  .trakt-summary-poster-overlay {
    border-radius: var(--border-radius-xxl);
    width: var(--ni-320);
    height: var(--ni-480);
  }

  .trakt-summary-poster {
    :global(img) {
      align-self: stretch;
      box-shadow: 0px 7.673px 23.02px 0px rgba(0, 0, 0, 0.56);
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter border;
      box-sizing: border-box;
    }
  }

  .trakt-summary-poster-overlay {
    position: absolute;
    opacity: 0;
    transition: opacity var(--transition-increment) ease-in-out;
    pointer-events: none;
  }

  .has-active-overlay:hover {
    :global(img) {
      filter: saturate(30%);
      border: var(--ni-2) solid var(--color-foreground);
    }

    & + .trakt-summary-poster-overlay {
      opacity: 1;
    }
  }
</style>
