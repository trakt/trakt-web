<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import ReactIcon from "$lib/components/icons/ReactIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { NOOP_FN } from "$lib/utils/constants";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { slide } from "svelte/transition";
  import { REACTIONS_MAP } from "./constants";
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

<button
  class="trakt-react-button"
  use:portalTrigger
  disabled={isDisabled}
  aria-label={m.button_label_popup_reactions()}
  class:is-current={$currentReaction}
  class:has-summary={$summary.count > 0}
>
  {#if $currentReaction}
    {REACTIONS_MAP[$currentReaction]}
  {:else}
    <ReactIcon />
    <span class="meta-info">{m.button_text_react()}</span>
  {/if}
</button>

{#if $isOpened}
  <div class="trakt-reaction-popup" use:portal>
    <div
      class="transition-wrapper"
      transition:slide={{ duration: 150, axis: "x" }}
    >
      <ActionButton
        label={m.button_label_close_reaction()}
        onclick={() => NOOP_FN}
        style="ghost"
      >
        <CloseIcon />
      </ActionButton>

      {#each Object.entries(REACTIONS_MAP) as [reaction, emoji] (reaction)}
        <div
          class="trakt-react-button-container"
          class:is-current={$currentReaction === reaction}
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
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-react-button {
    all: unset;

    display: flex;
    align-items: center;

    gap: var(--gap-s);
    border-radius: var(--border-radius-m);

    height: var(--ni-32);
    width: fit-content;

    padding: var(--ni-4) var(--ni-8);
    padding-right: var(--ni-10);
    box-sizing: border-box;

    border-radius: var(--border-radius-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, filter, opacity;

    &[disabled] {
      background-color: var(--color-reaction-disabled-background);
      filter: saturate(0.5);

      cursor: not-allowed;
    }

    &.is-current {
      padding: 0;
      width: var(--ni-32);

      justify-content: center;
      background-color: var(--color-reaction-background);
    }

    &.has-summary {
      padding: var(--ni-4);

      span.meta-info {
        display: none;
      }
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
    height: 100%;

    display: flex;
    align-items: center;

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-4);
    box-sizing: border-box;

    box-shadow: var(--popup-shadow);
  }

  .trakt-reaction-popup {
    position: relative;

    height: var(--ni-40);
    width: var(--ni-340);

    margin-top: var(--ni-neg-4);
    margin-left: var(--ni-neg-4);

    &:global([data-popup-position="left"]) {
      margin-left: 0;
      margin-right: var(--ni-neg-4);

      .transition-wrapper {
        position: absolute;
        right: 0;

        flex-direction: row-reverse;
      }
    }

    &:global([data-popup-position="unaligned"]) {
      margin: 0;

      .transition-wrapper {
        flex-direction: row-reverse;
      }
    }

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: font-size, background-color;

      border-radius: 50%;

      background-color: transparent;
      backdrop-filter: none;
      font-size: var(--ni-18);

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);

        color: var(--color-foreground);
      }
    }
  }

  .trakt-react-button-container:not(.is-current) {
    :global(.trakt-action-button) {
      &:hover {
        font-size: var(--ni-24);
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
