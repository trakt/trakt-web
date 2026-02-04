<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import ScrollLeftIcon from "../icons/ScrollLeftIcon.svelte";
  import ScrollRightIcon from "../icons/ScrollRightIcon.svelte";

  const { items }: { items: Snippet[] } = $props();

  let list: HTMLUListElement;
  let scrollLeft = $state(0);
  let scrollWidth = $state(0);
  let clientWidth = $state(0);

  function updateScrollState() {
    if (list) {
      scrollLeft = list.scrollLeft;
      scrollWidth = list.scrollWidth;
      clientWidth = list.clientWidth;
    }
  }

  function scroll(direction: "left" | "right") {
    if (!list) return;
    const amount = list.clientWidth;
    list.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  onMount(() => {
    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    if (list) {
      resizeObserver.observe(list);
    }

    return () => resizeObserver.disconnect();
  });

  const canScrollLeft = $derived(scrollLeft > 0);
  // Allow a small buffer (e.g. 1px) for floating point errors
  const canScrollRight = $derived(scrollLeft < scrollWidth - clientWidth - 1);

  // TODO find better carousel component?
</script>

<div class="carousel-wrapper">
  <button
    class="scroll-button left"
    onclick={() => scroll("left")}
    disabled={!canScrollLeft}
  >
    <ScrollLeftIcon />
  </button>

  <ul bind:this={list} onscroll={updateScrollState}>
    {#each items as item, index}
      <li data-accName={`Item ${index + 1}`}>
        {@render item()}
      </li>
    {/each}
  </ul>

  <button
    class="scroll-button right"
    onclick={() => scroll("right")}
    disabled={!canScrollRight}
  >
    <ScrollRightIcon />
  </button>
</div>

<style>
  .carousel-wrapper {
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
