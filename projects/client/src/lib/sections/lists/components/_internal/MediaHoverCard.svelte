<script lang="ts">
  import FlipCard from "$lib/components/card/FlipCard.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import type { Snippet } from "svelte";
  import SummaryCardBackgroundImage from "./SummaryCardBackgroundImage.svelte";
  import SummaryCardRating from "../SummaryCardRating.svelte";

  const {
    children,
    media,
    tag,
    contextualTag,
    subtitle,
  }: {
    children: Snippet<[Snippet<[Snippet]>]>;
    media: MediaInputDefault;
    tag?: Snippet;
    contextualTag?: Snippet;
    subtitle?: string;
  } = $props();

  let isFlipped = $state(false);
  let hasFlipped = $state(false);
  let coverArea = $state<HTMLElement>();

  const hasDistinctOriginalTitle = $derived(
    media.originalTitle
      ? media.title.toLowerCase() !== media.originalTitle.toLowerCase()
      : false,
  );

  function hoverFlip(node: HTMLElement) {
    const isPopupOpen = () =>
      node.querySelector('[data-popup-state="opened"]') != null;

    let isOverCover = false;

    const setFlipped = (next: boolean) => {
      if (isPopupOpen()) {
        return;
      }

      hasFlipped ||= next;
      isFlipped = next;
    };

    const onMove = (event: PointerEvent) => {
      const rect = coverArea?.getBoundingClientRect();

      isOverCover = rect != null &&
        event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom;

      setFlipped(isOverCover);
    };

    const onLeave = () => {
      isOverCover = false;
      setFlipped(false);
    };

    const popupObserver = new MutationObserver(() => setFlipped(isOverCover));

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    popupObserver.observe(node, {
      subtree: true,
      attributeFilter: ["data-popup-state"],
    });

    return {
      destroy() {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        popupObserver.disconnect();
      },
    };
  }
</script>

{#snippet flip(cover: Snippet)}
  <div class="hover-card-cover" bind:this={coverArea}>
    <FlipCard
      {isFlipped}
      front={cover}
      {back}
      --border-radius-flip-card="var(--border-radius-m)"
    />
  </div>
{/snippet}

{#snippet back()}
  <div class="hover-card-back" class:is-flipped={isFlipped}>
    {#if hasFlipped}
      <SummaryCardBackgroundImage
        src={media.cover.url.thumb}
        alt={media.title}
      />

      <div class="hover-card-details">
        <div class="hover-card-titles">
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
          <div class="hover-card-tags">
            {@render tag()}
          </div>
        {/if}
      </div>

      <div class="hover-card-bottom">
        {@render contextualTag?.()}
        <SummaryCardRating item={media} />
      </div>
    {/if}
  </div>
{/snippet}

<div
  class="trakt-media-hover-card"
  class:is-flipped={isFlipped}
  use:hoverFlip
>
  {@render children(flip)}
</div>

<style>
  .hover-card-back {
    box-sizing: border-box;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    color: var(--color-text-primary);
    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
    outline: var(--border-thickness-xs) solid var(--color-card-border-hover);
    overflow: hidden;
  }

  .hover-card-details {
    position: relative;
    z-index: var(--layer-raised);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    min-height: 0;
    overflow: hidden;

    padding: var(--ni-12);
    padding-bottom: var(--gap-s);
  }

  .hover-card-titles {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

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

    .trakt-card-subtitle,
    :global(.trakt-card-subtitle) {
      color: var(--color-text-secondary);
    }
  }

  .hover-card-tags {
    :global(.trakt-tag-bar) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      :global(:not(:last-child))::after {
        display: none;
      }
    }
  }

  .hover-card-bottom {
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
