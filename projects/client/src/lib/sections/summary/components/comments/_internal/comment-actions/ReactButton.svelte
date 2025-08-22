<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { scale } from "svelte/transition";
  import ReactionPicker from "./ReactionPicker.svelte";
  import ReactionsDistribution from "./ReactionsDistribution.svelte";
  import ReactionsSummary from "./ReactionsSummary.svelte";
  import { useCommentReaction } from "./useCommentReaction";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  const { portalTrigger, portal, isOpened, close } = usePortal({
    placement: { position: "top" },
    type: "persistent",
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
  const hasDistribution = $derived($currentReaction ?? $isReacting);
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
  <div
    class="trakt-reaction-popup"
    use:portal
    class:has-distribution={hasDistribution}
  >
    <div
      class="transition-wrapper"
      in:scale={{ duration: 150 }}
      out:scale={{ duration: 300 }}
    >
      <ReactionPicker
        currentReaction={$currentReaction}
        onChange={reactionHandler}
        onClose={close}
      />

      {#if hasDistribution}
        <ReactionsDistribution
          distribution={$summary.distribution}
          currentReaction={$currentReaction}
          isLoading={$isReacting}
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

    &[disabled]:not([data-popup-state="opened"]) {
      background-color: var(--color-reaction-disabled-background);
      filter: saturate(0.5);

      cursor: not-allowed;
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

    position: absolute;
    display: flex;

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);

    box-shadow: var(--popup-shadow);
  }

  .trakt-reaction-popup {
    position: relative;

    width: var(--ni-340);
    height: var(--ni-48);

    &.has-distribution {
      height: var(--ni-196);
    }

    &:global([data-popup-position="top"]) {
      .transition-wrapper {
        transform-origin: calc(50% - var(--alignment-correction, 0px)) bottom;
        flex-direction: column-reverse;

        bottom: 0;
      }
    }

    &:global([data-popup-position="bottom"]) {
      .transition-wrapper {
        transform-origin: calc(50% - var(--alignment-correction, 0px)) top;
        flex-direction: column;

        top: 0;
      }
    }
  }
</style>
