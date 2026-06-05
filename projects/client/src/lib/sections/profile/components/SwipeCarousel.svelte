<script lang="ts">
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { useSwipeCarousel } from "../stores/useSwipeCarousel.svelte";

  interface Props {
    slides: Snippet[];
    enabled?: boolean;
    onSlideProgress?: (progress: number) => void;
    onDragging?: (isDragging: boolean) => void;
  }

  const { slides, enabled = true, onSlideProgress, onDragging }: Props = $props();

  const carousel = untrack(() =>
    useSwipeCarousel(slides.length, {
      onSlideProgressChange: (p) => onSlideProgress?.(p),
      onDraggingChange: (d) => onDragging?.(d),
    })
  );

  function slideOpacity(index: number): number {
    return Math.max(0, 1 - Math.abs(carousel.slideProgress - index));
  }
</script>

<div class="swipe-carousel-root" use:carousel.setupSwipe={enabled}>
  <button
    class="swipe-carousel-nav"
    onclick={carousel.goToPrev}
    disabled={carousel.activeSlide === 0}
  >
    <CaretLeftIcon />
  </button>

  <div class="swipe-carousel-viewport">
    <div
      class="swipe-carousel-track"
      class:is-dragging={carousel.isDragging}
      style:transform={carousel.trackTransform}
      style:width="{slides.length * 100}%"
    >
      {#each slides as slide, i}
        <div
          class="swipe-carousel-item"
          class:is-dragging={carousel.isDragging}
          style:width="{100 / slides.length}%"
          style:opacity={slideOpacity(i)}
        >
          {@render slide()}
        </div>
      {/each}
    </div>
  </div>

  <button
    class="swipe-carousel-nav"
    onclick={carousel.goToNext}
    disabled={carousel.activeSlide === slides.length - 1}
  >
    <CaretRightIcon />
  </button>
</div>

<style lang="scss">
  .swipe-carousel-root {
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
  }
</style>
