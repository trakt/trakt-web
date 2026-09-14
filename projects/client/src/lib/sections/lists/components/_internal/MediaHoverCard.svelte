<script lang="ts">
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { Snippet } from "svelte";
  import { cubicOut } from "svelte/easing";
  import SummaryCardBackgroundImage from "./SummaryCardBackgroundImage.svelte";
  import SummaryCardRating from "./SummaryCardRating.svelte";

  const {
    children,
    media,
    tag,
    contextualTag,
    subtitle,
  }: {
    children: Snippet;
    media: MediaInputDefault;
    tag?: Snippet;
    contextualTag?: Snippet;
    subtitle?: string;
  } = $props();

  let isExpanded = $state(false);
  let isFlipped = $state(false);

  const prefersReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  function reveal(_node: HTMLElement) {
    if ($prefersReducedMotion) {
      return { duration: 90, css: (t: number) => `opacity: ${t}` };
    }

    return {
      duration: 150,
      easing: cubicOut,
      css: (t: number) => `
        width: calc(
          var(--panel-collapsed-width) +
            (var(--panel-width) - var(--panel-collapsed-width)) * ${t}
        );
        opacity: ${Math.min(1, t * 2.5)};
      `,
    };
  }

  const hasDistinctOriginalTitle = $derived(
    media.originalTitle
      ? media.title.toLowerCase() !== media.originalTitle.toLowerCase()
      : false,
  );

  function hoverReveal(node: HTMLElement) {
    const isPopupOpen = () =>
      node.querySelector('[data-popup-state="opened"]') != null;

    const onEnter = () => {
      const { right, width } = node.getBoundingClientRect();
      isFlipped = right + width > globalThis.window.innerWidth;
      isExpanded = true;
    };

    const onLeave = () => {
      if (isPopupOpen()) {
        return;
      }

      isExpanded = false;
    };

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);

    return {
      destroy() {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      },
    };
  }
</script>

<div
  class="trakt-media-hover-card"
  class:is-expanded={isExpanded}
  class:is-flipped={isFlipped}
  use:hoverReveal
>
  {#if isExpanded}
    <div class="hover-panel" transition:reveal>
      <SummaryCardBackgroundImage
        src={media.cover.url.thumb}
        alt={media.title}
        align={isFlipped ? "start" : "end"}
      />

      <div class="hover-panel-details">
        <div class="hover-panel-titles">
          <p class="trakt-card-title">{media.title}</p>

          {#if subtitle}
            <p class="trakt-card-subtitle small secondary">
              <bdi dir="ltr">{subtitle}</bdi>
            </p>
          {:else}
            {#if hasDistinctOriginalTitle}
              <p class="trakt-card-subtitle secondary">
                ({media.originalTitle})
              </p>
            {/if}

            <GenreList
              classList="trakt-card-subtitle small secondary"
              separator=", "
              genres={media.genres}
            />
          {/if}
        </div>

        {#if tag}
          <div class="hover-panel-tags">
            {@render tag()}
          </div>
        {/if}
      </div>

      <div class="hover-panel-bottom">
        {@render contextualTag?.()}
        <SummaryCardRating item={media} />
      </div>
    </div>
  {/if}

  <div class="hover-card-base">
    {@render children()}
  </div>
</div>

<style>
  .trakt-media-hover-card {
    --panel-inset: calc(0.5 * var(--list-gap));

    position: relative;

    &.is-expanded {
      z-index: var(--layer-top);

      .hover-card-base :global(.trakt-card-footer) {
        visibility: hidden;
      }

      .hover-card-base :global(.trakt-card-cover) {
        outline-color: transparent;
      }
    }
  }

  .hover-panel {
    --drift-sign: -1;
    --panel-width: calc(
      2 * var(--width-portrait-card) + var(--list-gap) + 2 * var(--panel-inset)
    );
    --panel-collapsed-width: calc(
      var(--width-portrait-card) + 2 * var(--panel-inset)
    );
    --panel-content-width: calc(
      var(--width-portrait-card) + var(--list-gap)
    );

    position: absolute;
    inset-block-start: calc(-1 * var(--panel-inset));
    inset-inline-start: calc(-1 * var(--panel-inset));

    width: var(--panel-width);
    height: calc(100% + 2 * var(--panel-inset));

    box-sizing: border-box;
    padding: var(--panel-inset);
    padding-inline-start: calc(var(--width-portrait-card) + var(--panel-inset));

    display: flex;
    flex-direction: column;

    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-menu);
    outline: var(--border-thickness-xs) solid var(--color-card-border-hover);

    overflow: hidden;

    .is-flipped & {
      --drift-sign: 1;

      align-items: flex-end;

      inset-inline-start: auto;
      inset-inline-end: calc(-1 * var(--panel-inset));

      padding-inline-start: var(--panel-inset);
      padding-inline-end: calc(var(--width-portrait-card) + var(--panel-inset));
    }
  }

  .hover-panel-details,
  .hover-panel-bottom {
    width: var(--panel-content-width);
    box-sizing: border-box;

    animation: hover-panel-drift var(--transition-increment)
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes hover-panel-drift {
    from {
      opacity: 0;
      transform: translateX(
        calc(var(--rtl-sign) * var(--drift-sign) * var(--ni-12))
      );
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .hover-panel-details {
    position: relative;
    z-index: var(--layer-raised);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    flex-grow: 1;
    overflow: hidden;

    padding: var(--ni-12);
    padding-top: var(--ni-10);
  }

  .hover-panel-titles {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    min-height: var(--ni-66);

    .trakt-card-title,
    .trakt-card-subtitle,
    :global(.trakt-card-subtitle) {
      display: -webkit-box;

      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      white-space: initial;
      overflow: hidden;
    }

    .trakt-card-title {
      min-width: 0;
      font-size: var(--font-size-text);
    }
  }

  .hover-panel-tags {
    :global(.trakt-tag-bar) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      :global(:not(:last-child))::after {
        display: none;
      }
    }
  }

  .hover-panel-bottom {
    position: relative;
    z-index: var(--layer-raised);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-12);
    padding-top: 0;

    :global(.trakt-summary-card-rating) {
      margin-inline-start: auto;
    }
  }
</style>
