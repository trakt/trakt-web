<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import SummaryCardBackgroundImage from "./_internal/SummaryCardBackgroundImage.svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import SummaryCardTitles from "./_internal/SummaryCardTitles.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

  const {
    children,
    contextualTag,
    ...props
  }: MediaCardProps & { children: Snippet; contextualTag?: Snippet } = $props();

  let isExpanded = $state(false);

  const showRating = $derived(
    props.variant !== "activity" && props.variant !== "next",
  );

  function hoverReveal(node: HTMLElement) {
    function isPopupOpen() {
      return !!node.querySelector('[data-popup-state="opened"]');
    }

    function reset() {
      isExpanded = false;
      node.classList.remove("is-open-left");
    }

    function onEnter() {
      isExpanded = true;
      const rect = node.getBoundingClientRect();
      node.classList.toggle(
        "is-open-left",
        rect.right + rect.width > window.innerWidth,
      );
    }

    function onLeave() {
      if (!isPopupOpen()) reset();
    }

    const observer = new MutationObserver(() => {
      if (!node.matches(":hover") && !isPopupOpen()) reset();
    });

    observer.observe(node, {
      subtree: true,
      attributeFilter: ["data-popup-state"],
    });

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);

    return {
      destroy() {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
        observer.disconnect();
      },
    };
  }

  /*
    TODO:
    DEAL WITH:
    - seasons/eps in lists
    - start watching
    - continue watching
    - history
    - social activity
    - compact/minimal states
    - library
    - sizing (e.g. when there are 2 lined footers)
    - card hover outline
    - clickable hover card
    */
</script>

<div class="trakt-hover-card" class:is-expanded={isExpanded} use:hoverReveal>
  {#if isExpanded}
    <div class="hover-panel" transition:fade={{ duration: 150 }}>
      {#if props.media.cover.url.thumb}
        <SummaryCardBackgroundImage
          src={props.media.cover.url.thumb}
          alt={`Background for ${props.media.title}`}
        />
      {/if}

      <div class="hover-panel-body">
        <SummaryCardTitles {...props} />
        <div class="hover-panel-tags">
          {@render props.tag?.()}
        </div>
      </div>
      <div class="hover-panel-footer">
        {@render contextualTag?.()}
        {#if showRating}
          <SummaryCardRating item={props.media} />
        {/if}
      </div>
    </div>
  {/if}
  <div class="hover-card-base">
    {@render children()}
  </div>
</div>

<style>
  :global(.trakt-gesture-container:has(.trakt-hover-card.is-expanded)) {
    z-index: 999;
  }

  .trakt-hover-card {
    position: relative;
    z-index: 0;

    &.is-expanded {
      z-index: var(--layer-top);

      :global(.trakt-card-footer) {
        display: none;
      }
    }

    &:global(.is-open-left) .hover-panel {
      left: auto;
      right: 0;

      padding-left: 0;
      padding-right: calc(var(--width-portrait-card) + var(--tooltip-offset));
    }
  }

  .hover-panel {
    --factor-width: 2;
    --tooltip-offset: calc(0.5 * var(--list-gap));

    position: absolute;
    top: 0;
    left: 0;

    margin: calc(var(--tooltip-offset) * -1);

    width: calc(
      var(--factor-width) * 100% + (var(--factor-width) - 1) * var(--list-gap) +
        var(--tooltip-offset)
    );
    height: 100%;

    background: var(--color-card-background);
    box-shadow: var(--shadow-menu);
    border-radius: var(--border-radius-m);

    overflow: hidden;

    padding-left: calc(var(--width-portrait-card) + var(--tooltip-offset));
    box-sizing: border-box;

    --height-summary-footer: calc(
      var(--height-portrait-card) - var(--height-portrait-card-cover)
    );

    .hover-panel-body {
      width: 100%;
      height: calc(100% - var(--height-summary-footer));

      padding: var(--ni-12);
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);

      :global(.trakt-card-title) {
        font-size: var(--font-size-text);

        display: -webkit-box;

        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        white-space: initial;
        overflow: hidden;
      }
    }

    .hover-panel-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: var(--height-summary-footer);

      padding: var(--ni-12);
      padding-top: var(--ni-8);
      padding-bottom: 0;
      box-sizing: border-box;

      display: flex;
      align-items: center;
      justify-content: flex-start;

      :global(span),
      :global(p) {
        font-size: var(--font-size-text-small);
      }

      :global(.trakt-summary-card-rating) {
        margin-left: auto;
      }
    }
  }

  .hover-card-base {
    position: relative;
  }

  .hover-panel-tags {
    :global(span),
    :global(p) {
      font-size: var(--font-size-text-small);
      font-weight: normal;
    }

    :global(.trakt-tag-bar) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      :global(:not(:last-child))::after {
        display: none;
      }
    }
  }
</style>
