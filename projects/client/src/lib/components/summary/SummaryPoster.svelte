<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import ArtworkPlaceholder from "$lib/components/skeleton/ArtworkPlaceholder.svelte";
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
    topTags?: Snippet;
    variant?: "portrait" | "landscape";
    isPriority?: boolean;
    /** The poster's two dominant colours, so the placeholder is its own. */
    colors?: [string, string] | Nil;
    /**
     * Hands the reveal to a caller that is sequencing this poster against
     * something else - the masthead holds it until its backdrop has landed
     * too. Left off, the poster reveals itself the moment it loads.
     */
    isRevealed?: boolean;
  };

  const {
    src,
    alt,
    href,
    actions,
    hoverOverlay,
    target = "_blank",
    tags,
    topTags,
    variant = "portrait",
    isPriority = false,
    colors,
    isRevealed,
  }: SummaryPosterProps = $props();

  const activeOverlay = $derived(href && hoverOverlay);

  const priorityProps = $derived(
    isPriority ? { loading: "eager" as const, fetchpriority: "high" } : {},
  );

  /*
    The skeleton holds the poster's shape until the image itself has landed. Keyed
    on the src rather than a flag so a poster swapped in place (browsing from one
    title to the next) shows the skeleton again instead of the previous image's
    "loaded" state. A failed load also clears it: the broken-image state is the
    image's to show, not the skeleton's to hide forever.
  */
  let settledSrc = $state<string | null>(null);
  const isImageSettled = $derived(
    isRevealed ?? settledSrc === src,
  );
</script>

<div class="trakt-summary-poster-container" data-variant={variant}>
  <div class="trakt-summary-poster" class:has-active-overlay={activeOverlay}>
    {#if !isImageSettled}
      <div
        class="poster-skeleton"
        out:fade={{ duration: 300 }}
        aria-hidden="true"
      >
        <ArtworkPlaceholder
          {colors}
          radius="var(--summary-poster-radius, var(--border-radius-xxl))"
        />
      </div>
    {/if}
    <Link {href} {target}>
      <CrossOriginImage
        {src}
        {alt}
        {...priorityProps}
        onload={() => (settledSrc = src)}
        onerror={() => (settledSrc = src)}
      />
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

  {#if topTags}
    <div
      class="trakt-summary-poster-tags trakt-summary-poster-top-tags"
      transition:fade={{ duration: 150 }}
    >
      {@render topTags()}
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
    border-radius: var(--summary-poster-radius, var(--border-radius-xxl));
  }

  .trakt-summary-poster {
    position: relative;

    /*
      Behind the image, in its exact box: the image sits on top at opacity 0 and
      fades in over it (see CrossOriginImage), so the swap is a cross-fade rather
      than a pop.
    */
    .poster-skeleton {
      position: absolute;
      inset: 0;

      width: var(--summary-poster-width);
      aspect-ratio: var(--poster-aspect-ratio);

      pointer-events: none;
    }

    :global(img) {
      position: relative;
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
    inset-inline: 0;

    transform: translateY(50%);
  }

  /* Same seat as the bottom tags, mirrored onto the poster's top edge. */
  .trakt-summary-poster-top-tags {
    bottom: auto;
    top: 0;

    transform: translateY(-50%);
  }
</style>
