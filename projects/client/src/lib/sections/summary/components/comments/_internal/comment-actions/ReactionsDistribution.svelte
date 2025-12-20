<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { slide } from "svelte/transition";
  import type { ReactionDistribution } from "../models/ReactionDistribution";
  import { REACTIONS_CODE_MAP } from "./constants";
  import ReactionDetails from "./ReactionDetails.svelte";

  const {
    distribution,
    currentReaction,
    isLoading,
  }: {
    distribution?: ReactionDistribution;
    currentReaction: Reaction | Nil;
    isLoading: boolean;
  } = $props();
</script>

<div
  class="trakt-reactions-distribution"
  class:is-loading={isLoading}
  out:slide={{ duration: 150, axis: "y" }}
>
  <span class="bold secondary trakt-distribution-header">
    <ReactionIcon state="default" />{m.header_comment_reactions()}
  </span>
  <div class="trakt-reactions">
    {#each Object.entries(REACTIONS_CODE_MAP) as [reaction], index (reaction)}
      <ReactionDetails
        reaction={reaction as Reaction}
        count={distribution?.[reaction as Reaction] ?? 0}
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
