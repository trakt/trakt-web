<script lang="ts">
  import type { Genre } from "@trakt/api";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { GENRES } from "$lib/features/filters/_internal/genres.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";

  type Props = {
    activeGenre: Genre | null;
  };

  const { activeGenre }: Props = $props();

  let trackEl = $state<HTMLDivElement | undefined>();
  let canScrollLeft = $state(false);
  let canScrollRight = $state(true);

  const updateScrollState = () => {
    if (!trackEl) return;
    canScrollLeft = trackEl.scrollLeft > 0;
    canScrollRight =
      trackEl.scrollLeft < trackEl.scrollWidth - trackEl.clientWidth - 1;
  };

  const scroll = (direction: "left" | "right") => {
    if (!trackEl?.firstElementChild) return;
    const pillWidth = trackEl.firstElementChild.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(trackEl).columnGap) || 0;
    const amount = 3 * (pillWidth + gap);
    trackEl.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };
</script>

<div class="genre-pill-carousel">
  <button
    class="scroll-btn"
    onclick={() => scroll("left")}
    disabled={!canScrollLeft}
    aria-label="Scroll genres left"
  >
    <CaretLeftIcon />
  </button>

  <div class="pill-track" bind:this={trackEl} onscroll={updateScrollState}>
    {#each GENRES as g (g)}
      <a
        href="/discover/genre/{g}"
        class="genre-pill"
        class:active={g === activeGenre}
      >
        {toTranslatedGenre(g)}
      </a>
    {/each}
  </div>

  <button
    class="scroll-btn"
    onclick={() => scroll("right")}
    disabled={!canScrollRight}
    aria-label="Scroll genres right"
  >
    <CaretRightIcon />
  </button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .genre-pill-carousel {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    max-width: calc(
      10 * var(--width-portrait-card) * 0.765 + 9 * var(--list-gap) +
      2 * var(--ni-16) + 2 * var(--gap-xs)
    );
    width: 100%;
    margin: 0 auto;

    @include for-tablet-sm-and-below {
      max-width: none;
      margin: 0;
      padding: 0 var(--layout-distance-side);
      box-sizing: border-box;
    }
  }

  .scroll-btn {
    all: unset;
    cursor: pointer;
    color: var(--color-text-primary);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    transition: opacity var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &:disabled {
      opacity: 0.2;
      cursor: default;
    }
  }

  .pill-track {
    display: flex;
    gap: var(--list-gap);
    overflow-x: hidden;
    scrollbar-width: none;
    flex: 1;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .genre-pill {
    flex: 0 0 calc(var(--width-portrait-card) * 0.765);
    width: calc(var(--width-portrait-card) * 0.765);

    @include for-tablet-sm-and-below {
      flex: 0 0 calc((100% - 2 * var(--list-gap)) / 3);
      width: calc((100% - 2 * var(--list-gap)) / 3);
    }
    height: var(--ni-28);
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-xxl);
    background-color: var(--color-card-background);
    color: var(--color-text-primary);
    text-decoration: none;
    font-size: var(--font-size-text-small);
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    padding: 0 var(--ni-4);

    transition:
      background-color var(--transition-increment) ease-in-out,
      color var(--transition-increment) ease-in-out;

    &.active {
      background-color: var(--purple-500);
      color: var(--color-overlay-foreground);
    }

    @include for-mouse {
      &:not(.active):hover {
        background-color: var(--color-calendar-background-hover);
      }
    }
  }

  @mixin light-pills {
    .genre-pill:not(.active) {
      background-color: var(--shade-80);
    }

    @include for-mouse {
      .genre-pill:not(.active):hover {
        background-color: var(--shade-300);
      }
    }
  }

  :global([data-theme='light']) {
    @include light-pills;
  }

  :global([data-theme='system']) {
    @media (prefers-color-scheme: light) {
      @include light-pills;
    }
  }
</style>
