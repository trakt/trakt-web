<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { reactionsSchema } from "@trakt/api";
  import ReactionPicker from "$lib/components/reactions/ReactionPicker.svelte";
  import ReactionsDistribution from "$lib/components/reactions/ReactionsDistribution.svelte";
  import ReactionsPopup from "$lib/components/reactions/ReactionsPopup.svelte";
  import ReactionsSummary from "./ReactionsSummary.svelte";
  import { toReactionPickerOptions } from "$lib/components/reactions/toReactionPickerOptions.ts";
  import { useCommentReaction } from "./useCommentReaction";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  // FIXME: add reactions support to replies and switch to extended=reactions everywhere
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

  const options = toReactionPickerOptions(reactionsSchema.options);
  const chosen = $derived($currentReaction ? [$currentReaction] : []);

  const isDisabled = $derived($isReacting);
  const hasDistribution = $derived($summary.count > 0 || $isReacting);
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
  <ReactionsPopup reserve="var(--ni-196)">
    {#snippet trigger(attach)}
      <button
        class="trakt-react-button"
        use:attach
        disabled={isDisabled}
        aria-label={m.button_label_popup_reactions()}
        class:is-current={$currentReaction}
        class:has-summary={$summary.count > 0}
      >
        {@render content()}
      </button>
    {/snippet}

    {#snippet children(close)}
      {#if hasDistribution}
        <ReactionsDistribution
          reactions={reactionsSchema.options}
          distribution={$summary.distribution}
          current={chosen}
          onRemove={reactionHandler}
          isLoading={$isReacting}
          title={m.header_comment_reactions()}
        />
      {/if}

      <ReactionPicker
        {options}
        {chosen}
        onSelect={reactionHandler}
        onClose={close}
      />
    {/snippet}
  </ReactionsPopup>
</RenderFor>

<RenderFor audience="public">
  <div class="trakt-react-preview">
    {@render content()}
  </div>
</RenderFor>

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
      padding-inline-end: var(--ni-10);
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
</style>
