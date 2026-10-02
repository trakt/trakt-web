<script lang="ts">
  import SwipeCarousel from "$lib/components/carousel/SwipeCarousel.svelte";
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import type { AnyReaction } from "$lib/requests/models/AnyReaction.ts";
  import { slide } from "svelte/transition";
  import { chunk } from "$lib/utils/array/chunk.ts";
  import ReactionDetails from "./ReactionDetails.svelte";
  import type { ReactionsDistributionProps } from "./ReactionsDistributionProps.ts";

  const {
    reactions,
    distribution,
    current,
    isLoading,
    title,
    order = "canonical",
    pageSize,
  }: ReactionsDistributionProps = $props();

  const countOf = (reaction: AnyReaction) => distribution?.[reaction] ?? 0;

  const ordered = $derived(
    order === "canonical"
      ? reactions
      : reactions.toSorted((a, b) => countOf(b) - countOf(a)),
  );

  const pages = $derived.by(() => {
    if (pageSize == null || ordered.length <= pageSize) return [ordered];

    return chunk(ordered, pageSize);
  });
</script>

{#snippet grid(page: ReadonlyArray<AnyReaction>)}
  <div class="trakt-reactions">
    {#each page as reaction, index (reaction)}
      <ReactionDetails
        {reaction}
        count={countOf(reaction)}
        isCurrent={current.includes(reaction)}
        {index}
      />
    {/each}
  </div>
{/snippet}

<div
  class="trakt-reactions-distribution"
  class:is-loading={isLoading}
  out:slide={{ duration: 150, axis: "y" }}
>
  <span class="bold secondary trakt-distribution-header">
    <ReactionIcon />{title}
  </span>
  {#if pages.length > 1}
    <SwipeCarousel items={pages}>
      {#snippet item(page)}
        {@render grid(page)}
      {/snippet}
    </SwipeCarousel>
  {:else}
    {@render grid(ordered)}
  {/if}
</div>

<style>
  .trakt-reactions-distribution {
    display: flex;
    flex-direction: column;

    gap: var(--gap-s);

    background: var(--color-reaction-distribution-background);
    border-radius: var(--border-radius-xxl);

    height: 0;
    opacity: 0;

    overflow: hidden;
    animation: grow var(--transition-increment) ease-in;
    animation-delay: calc(var(--transition-increment) / 2);
    animation-fill-mode: forwards;

    &.is-loading {
      .trakt-reactions {
        opacity: 0.5;
      }
    }
  }

  @keyframes grow {
    100% {
      padding: var(--ni-16);
      height: var(--ni-104);
      margin: var(--ni-8);
      opacity: 1;
    }
  }

  .trakt-reactions-distribution :global(.trakt-swipe-carousel) {
    --swipe-carousel-nav-overlap: var(--ni-12);
  }

  .trakt-distribution-header {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }

  .trakt-reactions {
    display: grid;

    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(4, 1fr);

    row-gap: var(--ni-12);
    column-gap: var(--ni-4);
  }
</style>
