<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { slide } from "svelte/transition";
  import ReactionPicker from "./ReactionPicker.svelte";
  import ReactionsDistribution from "./ReactionsDistribution.svelte";
  import ReactionsSummary from "./ReactionsSummary.svelte";
  import { useCommentReaction } from "./useCommentReaction";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  const { portalTrigger, portal, isOpened } = usePortal({
    placement: { position: "right", mode: "contain" },
  });

  const { currentReaction, summary } = $derived(
    useCommentReactions({ id: comment.id }),
  );
  const { react, remove, isReacting } = $derived(
    useCommentReaction({ id: comment.id }),
  );

  function reactionHandler(reaction: Reaction) {
    if ($currentReaction === reaction) {
      remove();
      return;
    }

    react(reaction);
  }

  const isDisabled = $derived($isReacting);
</script>

{#snippet content()}
  <RenderFor audience="authenticated">
    <ReactionIcon state={$currentReaction ? "edit" : "add"} />
  </RenderFor>

  <RenderFor audience="public">
    <ReactionIcon state="default" />
  </RenderFor>

  {#if $summary.count > 0}
    <ReactionsSummary summary={$summary} />
  {/if}
{/snippet}

<RenderFor audience="authenticated">
  <button
    class="trakt-react-button"
    use:portalTrigger
    disabled={isDisabled}
    aria-label={m.button_label_popup_reactions()}
    class:is-current={$currentReaction}
    class:has-summary={$summary.count > 0}
  >
    {@render content()}
  </button>
</RenderFor>

<RenderFor audience="public">
  <div class="trakt-react-preview">
    {@render content()}
  </div>
</RenderFor>

{#if $isOpened}
  <div class="trakt-reaction-popup" use:portal>
    <div
      class="transition-wrapper"
      transition:slide={{ duration: 150, axis: "x" }}
    >
      <ReactionPicker
        currentReaction={$currentReaction}
        onChange={reactionHandler}
      />

      {#if $currentReaction}
        <ReactionsDistribution
          distribution={$summary.distribution}
          currentReaction={$currentReaction}
        />
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-react-preview,
  .trakt-react-button {
    all: unset;

    user-select: none;

    display: flex;
    align-items: center;

    gap: var(--gap-xs);

    height: var(--ni-32);
    width: fit-content;

    padding: var(--ni-4) var(--ni-8);
    box-sizing: border-box;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .trakt-react-button {
    border-radius: var(--border-radius-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, filter, opacity;

    &.has-summary {
      padding-right: var(--ni-10);
    }

    &[disabled] {
      background-color: var(--color-reaction-disabled-background);
      filter: saturate(0.5);

      cursor: not-allowed;
    }

    &:global([data-popup-state="opened"]) {
      pointer-events: none;
      opacity: 0;
    }

    @include for-mouse {
      &:not([disabled]) {
        &:not([data-popup-state="opened"]):hover {
          background-color: var(--color-reaction-background-hover);
          cursor: pointer;
        }
      }
    }
  }

  .transition-wrapper {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-4);
    box-sizing: border-box;

    box-shadow: var(--popup-shadow);
  }

  .trakt-reaction-popup {
    --popup-offset: var(--ni-neg-10);
    position: relative;

    width: var(--ni-340);

    margin-top: var(--popup-offset);
    margin-left: var(--popup-offset);

    &:global([data-popup-position="left"]) {
      margin-left: 0;
      margin-right: var(--popup-offset);

      .transition-wrapper {
        position: absolute;
        right: 0;

        :global(.trakt-reaction-picker) {
          flex-direction: row-reverse;
        }
      }
    }

    &:global([data-popup-position="unaligned"]) {
      margin: 0;

      .transition-wrapper {
        flex-direction: row-reverse;
      }
    }
  }
</style>
