<script lang="ts" generics="T">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SwipeCarouselProps } from "./SwipeCarouselProps.ts";
  import { useSwipeCarousel } from "./_internal/useSwipeCarousel.svelte.ts";

  const {
    items,
    item,
    enabled = true,
    onSlideProgress,
    onDragging,
  }: SwipeCarouselProps<T> = $props();

  const carousel = useSwipeCarousel(() => items.length, {
    onSlideProgressChange: (p) => onSlideProgress?.(p),
    onDraggingChange: (d) => onDragging?.(d),
  });

  function slideOpacity(index: number): number {
    return Math.max(0, 1 - Math.abs(carousel.slideProgress - index));
  }
</script>

<div class="trakt-swipe-carousel" use:carousel.setupSwipe={enabled}>
  <button
    class="swipe-carousel-nav"
    onclick={carousel.goToPrev}
    disabled={carousel.activeSlide === 0}
    aria-label={m.button_label_carousel_previous()}
  >
    <CaretLeftIcon />
  </button>

  <div class="swipe-carousel-viewport">
    <div
      class="swipe-carousel-track"
      class:is-dragging={carousel.isDragging}
      style:transform={carousel.trackTransform}
      style:width="{items.length * 100}%"
    >
      {#each items as entry, i (i)}
        <div
          class="swipe-carousel-item"
          class:is-dragging={carousel.isDragging}
          style:width="{100 / items.length}%"
          style:opacity={slideOpacity(i)}
        >
          {@render item(entry, i)}
        </div>
      {/each}
    </div>
  </div>

  <button
    class="swipe-carousel-nav"
    onclick={carousel.goToNext}
    disabled={carousel.activeSlide === carousel.lastSlide}
    aria-label={m.button_label_carousel_next()}
  >
    <CaretRightIcon />
  </button>
</div>

<style lang="scss">
  .trakt-swipe-carousel {
    touch-action: pan-y;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .swipe-carousel-viewport {
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }

  .swipe-carousel-track {
    display: flex;
    align-items: center;
    transition: transform 0.25s ease-in-out;

    &.is-dragging {
      transition: none;
    }
  }

  .swipe-carousel-item {
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    transition: opacity 0.25s ease-in-out;

    &.is-dragging {
      transition: none;
    }

    > :global(*) {
      justify-content: center;
    }
  }

  .swipe-carousel-nav {
    all: unset;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    opacity: 0.6;
    transition: opacity var(--transition-increment) ease-in-out;

    &:disabled {
      opacity: 0.2;
      cursor: default;
    }

    &:not(:disabled):hover {
      opacity: 1;
    }

    &:first-child {
      margin-inline-start: calc(-1 * var(--swipe-carousel-nav-overlap, 0px));
    }

    &:last-child {
      margin-inline-end: calc(-1 * var(--swipe-carousel-nav-overlap, 0px));
    }
  }
</style>
