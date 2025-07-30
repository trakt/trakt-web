<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { slide } from "svelte/transition";
  import { REACTIONS_MAP } from "./constants";
  import ReactionsSummary from "./ReactionsSummary.svelte";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  const { portalTrigger, portal, isOpened } = usePortal();
  const { reactions, react, remove, isLoading, isReacting } = $derived(
    useCommentReactions({ id: comment.id }),
  );

  function reactionHandler(reaction: Reaction) {
    if ($reactions.current === reaction) {
      remove();
      return;
    }

    react(reaction);
  }

  const isDisabled = $derived($isLoading || $isReacting);
</script>

<button
  class="trakt-reaction-button"
  use:portalTrigger
  disabled={isDisabled}
  aria-label={m.button_label_popup_reactions()}
>
  {#if $reactions.current}
    {REACTIONS_MAP[$reactions.current]}
  {:else}
    <LikeIcon style="open" />
  {/if}

  <ReactionsSummary {comment} />
</button>

{#if $isOpened}
  <div
    class="trakt-reaction-selector"
    use:portal
    transition:slide={{ duration: 150 }}
  >
    {#each Object.entries(REACTIONS_MAP) as [reaction, emoji] (reaction)}
      <div
        class="trakt-react-button-container"
        class:is-current={$reactions.current === reaction}
      >
        <ActionButton
          label={m.button_label_react({
            reaction: toTranslatedValue("reaction", reaction),
          })}
          onclick={() => reactionHandler(reaction as Reaction)}
          style="ghost"
        >
          {emoji}
        </ActionButton>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-button {
    all: unset;

    display: flex;
    align-items: center;

    gap: var(--gap-s);
    border-radius: var(--border-radius-m);

    height: var(--ni-40);
    padding: var(--ni-12);
    box-sizing: border-box;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, filter;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &[disabled] {
      background-color: var(--color-reactions-disabled-background);
      filter: saturate(0.5);

      cursor: not-allowed;
    }

    @include for-mouse {
      &:not([disabled]) {
        &:not([data-popup-state="opened"]):hover {
          background-color: var(--color-reactions-preview-background);
          cursor: pointer;

          :global(.trakt-reactions-summary) {
            background-color: var(--color-reactions-preview-hover);
          }
        }
      }
    }
  }

  .trakt-reaction-selector {
    margin-top: var(--ni-neg-56);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    background-color: var(--color-reactions-popup-background);
    border-radius: var(--border-radius-l);

    padding: var(--ni-8);

    box-shadow: var(--ni-0) var(--ni-4) var(--ni-8) var(--ni-4)
      color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: font-size, background-color;

      font-size: var(--ni-24);
    }
  }

  .trakt-react-button-container:not(.is-current) {
    :global(.trakt-action-button) {
      &:hover {
        font-size: var(--ni-38);
      }
    }
  }

  .trakt-react-button-container.is-current {
    :global(.trakt-action-button) {
      background-color: var(--color-current-reaction-background);

      @include for-touch {
        background-color: var(--color-current-reaction-hover);
      }

      &:hover {
        background-color: var(--color-current-reaction-hover);
      }
    }
  }
</style>
