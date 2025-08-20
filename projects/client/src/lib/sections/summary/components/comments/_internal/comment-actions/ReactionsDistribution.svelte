<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import type { ReactionDistribution } from "../models/ReactionDistribution";
  import { REACTIONS_MAP } from "./constants";
  import ReactionDetails from "./ReactionDetails.svelte";

  const {
    distribution,
    currentReaction,
  }: { distribution: ReactionDistribution; currentReaction: Reaction } =
    $props();
</script>

<div class="trakt-reactions-distribution">
  <span class="meta-info secondary trakt-distribution-header">
    <ReactionIcon state="default" />{m.header_comment_reactions()}
  </span>
  <div class="trakt-reactions">
    {#each Object.entries(REACTIONS_MAP) as [reaction] (reaction)}
      <ReactionDetails
        reaction={reaction as Reaction}
        count={distribution[reaction as Reaction] ?? 0}
        isCurrent={currentReaction === reaction}
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

    padding: var(--ni-16);
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
