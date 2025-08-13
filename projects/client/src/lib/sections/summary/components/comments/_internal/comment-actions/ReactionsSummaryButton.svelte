<script lang="ts">
  import ReactionsIcon from "$lib/components/icons/ReactionsIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { slide } from "svelte/transition";
  import { REACTIONS_MAP } from "./constants";
  import ReactionDetails from "./ReactionDetails.svelte";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  const { summary, isLoading, currentReaction } = $derived(
    useCommentReactions({ id: comment.id }),
  );

  const { portalTrigger, portal, isOpened } = usePortal({
    placement: { position: "top" },
  });

  const restCount = $derived($summary.count - $summary.topCount);
</script>

{#if !$isLoading && $summary.count > 0}
  <button class="trakt-reactions-summary" use:portalTrigger>
    {$summary.top.map(([reaction]) => REACTIONS_MAP[reaction]).join(" ")}
    {#if restCount > 0}
      <p class="smaller">+{toHumanNumber(restCount, getLocale())}</p>
    {/if}
  </button>
{/if}

{#if $isOpened}
  <div class="trakt-reactions-popup" use:portal>
    <div class="transition-wrapper" transition:slide={{ duration: 150 }}>
      <span class="meta-info secondary reactions-header">
        <ReactionsIcon />{m.header_comment_reactions()}
      </span>
      <div class="trakt-reactions">
        {#each Object.entries(REACTIONS_MAP) as [reaction] (reaction)}
          <ReactionDetails
            reaction={reaction as Reaction}
            count={$summary.distribution[reaction as Reaction] ?? 0}
            isCurrent={$currentReaction === reaction}
          />
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reactions-summary {
    all: unset;

    cursor: pointer;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-4) var(--ni-8);
    height: var(--ni-32);
    box-sizing: border-box;

    user-select: none;

    border-radius: var(--border-radius-l);
    transition: background-color var(--transition-increment) ease-in-out;

    p.smaller {
      font-weight: 700;
    }

    &:not([data-popup-state="opened"]) {
      @include for-mouse {
        &:hover {
          background-color: var(--color-reaction-background-hover);
        }
      }
    }
  }

  .transition-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-s);

    box-sizing: border-box;

    border-radius: var(--border-radius-xxl);
    padding: var(--ni-16);
    background-color: var(--color-reaction-background);

    box-shadow: var(--popup-shadow);
  }

  .trakt-reactions-popup {
    user-select: none;

    position: relative;

    min-width: var(--ni-320);
    height: var(--ni-144);

    &:global([data-popup-position="top"]) {
      margin-bottom: var(--ni-8);

      .transition-wrapper {
        position: absolute;
        bottom: 0;
      }
    }

    &:global([data-popup-position="bottom"]) {
      margin-top: var(--ni-8);

      .transition-wrapper {
        position: absolute;
        top: 0;
      }
    }

    .reactions-header {
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
  }
</style>
