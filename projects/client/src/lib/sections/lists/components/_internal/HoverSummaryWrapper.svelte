<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  const {
    coverCard,
    summaryOverlay,
    orientation = "portrait",
  }: {
    coverCard: Snippet;
    summaryOverlay: Snippet;
    orientation?: "portrait" | "landscape";
  } = $props();

  let isHovered = $state(false);
  let flipLeft = $state(false);
  let rootEl: HTMLDivElement | undefined = $state();
  let wrapperWidth = $state(0);

  // Ratio of cover image height to width for each orientation (from layout/index.scss)
  // Portrait: --height-portrait-card-cover = --width-portrait-card * 1.5
  // Landscape: --height-landscape-card-cover = --width-landscape-card / 1.786 (≈ 16:9)
  const PORTRAIT_COVER_RATIO = 1.5;
  const LANDSCAPE_COVER_RATIO = 1 / 1.786;
  const CARD_FOOTER_HEIGHT = 40; // --height-card-footer: var(--ni-40)

  const coverImageHeight = $derived(
    wrapperWidth *
      (orientation === "portrait" ? PORTRAIT_COVER_RATIO : LANDSCAPE_COVER_RATIO),
  );

  // Override the cover card's height CSS vars to match actual column width.
  // Without this, PortraitCard/LandscapeCard use their globally computed heights
  // (based on --width-portrait-card ≈ 132px) while the grid stretches the width
  // to 100% of the column, producing very wide, flat cards.
  const coverStyle = $derived(
    wrapperWidth > 0
      ? orientation === "portrait"
        ? `--height-portrait-card-cover: ${coverImageHeight}px; --height-portrait-card: ${coverImageHeight + CARD_FOOTER_HEIGHT}px;`
        : `--height-landscape-card-cover: ${coverImageHeight}px; --height-landscape-card: ${coverImageHeight + CARD_FOOTER_HEIGHT}px;`
      : undefined,
  );

  // The overlay always uses portrait proportions so the poster (--poster-aspect-ratio = 0.6667)
  // fills exactly half the overlay width:
  //   poster_width = overlay_cover_height × 0.6667
  //   For poster_width = wrapperWidth → overlay_cover_height = wrapperWidth × 1.5
  const overlayCoverHeight = $derived(wrapperWidth * PORTRAIT_COVER_RATIO);

  let overlayTop = $state(0);
  let overlayLeft = $state(0);

  const overlayStyle = $derived(
    wrapperWidth > 0
      ? `--hover-overlay-width: ${wrapperWidth * 2}px; --height-summary-card-cover: ${overlayCoverHeight}px; --height-summary-card: ${overlayCoverHeight}px; top: ${overlayTop}px; left: ${overlayLeft}px; width: ${wrapperWidth * 2}px;`
      : undefined,
  );

  // Portal the overlay to document.body so it escapes contain:layout ancestors
  // (SectionList, GridList) that would otherwise confine position:fixed coordinates
  // to the section container rather than the viewport.
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  // Debounce hide so moving mouse from root into the fixed overlay doesn't
  // trigger an immediate mouseleave-hide before mouseenter fires on the overlay.
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function cancelHide() {
    if (hideTimer !== undefined) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }
  }

  function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(() => {
      isHovered = false;
      hideTimer = undefined;
    }, 80);
  }

  function handleMouseEnter() {
    cancelHide();
    isHovered = true;
    if (rootEl) {
      const rect = rootEl.getBoundingClientRect();
      flipLeft = rect.right + rect.width > window.innerWidth;
      overlayLeft = flipLeft ? rect.left - rect.width : rect.left;
      overlayTop = rect.top;
    }
  }

  function handleMouseLeave() {
    scheduleHide();
  }
</script>

<div
  class="trakt-hover-summary-root"
  bind:clientWidth={wrapperWidth}
  bind:this={rootEl}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  data-orientation={orientation}
  style={coverStyle}
>
  {@render coverCard()}

  {#if isHovered}
    <div
      use:portal
      class="trakt-hover-summary-overlay"
      class:flip-left={flipLeft}
      style={overlayStyle}
      onmouseenter={cancelHide}
      onmouseleave={scheduleHide}
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 100 }}
    >
      {@render summaryOverlay()}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-hover-summary-root {
    position: relative;
  }

  .trakt-hover-summary-overlay {
    position: fixed;
    z-index: 10;
    width: var(--hover-overlay-width);

    &.flip-left {
      :global(.trakt-card-content > .trakt-link) {
        flex-direction: row-reverse;
      }

      :global(.trakt-summary-card-bottom-bar) {
        right: auto;
        left: 0;
      }

      :global(.trakt-summary-card-background) {
        mask-image: linear-gradient(300deg, #000 0%, #000 15%, transparent 50%);

        :global(img) {
          right: auto;
          left: 0;
        }
      }
    }
  }
</style>
