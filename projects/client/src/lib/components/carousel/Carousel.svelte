<script lang="ts">
  import type { Snippet } from "svelte";
  import ScrollLeftIcon from "../icons/ScrollLeftIcon.svelte";
  import ScrollRightIcon from "../icons/ScrollRightIcon.svelte";
  import { useCarouselScroll } from "./_internal/useCarouselScroll";

  const { items }: { items: Snippet[] } = $props();

  const { canScrollLeft, canScrollRight, scrollObserver, scroll } =
    useCarouselScroll();

  // FIXME: find existing component to replace this with
</script>

<div class="trakt-carousel">
  <button
    class="scroll-button left"
    onclick={() => scroll("left")}
    disabled={!$canScrollLeft}
  >
    <ScrollLeftIcon />
  </button>

  <ul use:scrollObserver>
    {#each items as item}
      <li>
        {@render item()}
      </li>
    {/each}
  </ul>

  <button
    class="scroll-button right"
    onclick={() => scroll("right")}
    disabled={!$canScrollRight}
  >
    <ScrollRightIcon />
  </button>
</div>

<style>
  .trakt-carousel {
    --button-spacing: var(--ni-16);
    --scroll-button-size: var(--ni-32);

    position: relative;
    width: 100%;
    height: 100%;

    padding: 0 calc(var(--button-spacing) + var(--scroll-button-size));
    box-sizing: border-box;
  }

  ul {
    padding: 0;
    margin: 0;

    width: 100%;
    height: 100%;

    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  ul::-webkit-scrollbar {
    display: none;
  }

  li {
    box-sizing: border-box;
    list-style-type: none;

    flex: 0 0 100%;
    height: 100%;
    scroll-snap-align: center;
  }

  .scroll-button {
    all: unset;
    color: var(--color-text-primary);
    cursor: pointer;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    transition: opacity var(--transition-increment) ease-in-out;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

    :global(svg) {
      width: var(--scroll-button-size);
      height: var(--scroll-button-size);
    }
  }

  .scroll-button:disabled {
    opacity: 0.2;
    cursor: unset;
  }
</style>
