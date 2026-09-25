<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import type { ReactionDistribution } from "$lib/requests/models/ReactionDistribution.ts";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { slide } from "svelte/transition";
  import ReactionDetails from "./ReactionDetails.svelte";
  import { reactionsInOrder } from "./reactionsInOrder.ts";

  /*
    Every reaction and its count, under a heading.

    Shared between a review's popup and a title's, which is why the heading and
    the ordering are handed in. A review lists the taxonomy in its canonical
    order, where a reaction's position is the one fixed thing about the panel
    and a count ticking up must not move it. A title is being asked which
    reactions it is best known for, and an answer to that has to lead with the
    most used.
  */
  const {
    distribution,
    currentReaction,
    isLoading,
    title,
    order = "canonical",
  }: {
    distribution?: ReactionDistribution;
    currentReaction: Reaction | Nil;
    isLoading: boolean;
    title: string;
    order?: "canonical" | "ranked";
  } = $props();

  const countOf = (reaction: Reaction) => distribution?.[reaction] ?? 0;

  /*
    Canonical order is the tiebreak rather than a second sort key, so the
    reactions nobody picked - at zero, most of the panel on a quiet title -
    hold the order the taxonomy declares instead of wherever the sort leaves
    them. Array.sort is stable, so reading from the canonical list is enough.
  */
  const ordered = $derived(
    order === "canonical"
      ? reactionsInOrder
      : [...reactionsInOrder].sort((a, b) => countOf(b) - countOf(a)),
  );
</script>

<div
  class="trakt-reactions-distribution"
  class:is-loading={isLoading}
  out:slide={{ duration: 150, axis: "y" }}
>
  <span class="bold secondary trakt-distribution-header">
    <ReactionIcon state="default" />{title}
  </span>
  <div class="trakt-reactions">
    {#each ordered as reaction, index (reaction)}
      <ReactionDetails
        {reaction}
        count={countOf(reaction)}
        isCurrent={currentReaction === reaction}
        {index}
      />
    {/each}
  </div>
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
