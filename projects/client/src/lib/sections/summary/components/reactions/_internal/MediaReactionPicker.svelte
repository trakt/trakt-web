<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserMediaReaction } from "$lib/requests/queries/reactions/userMediaReactionsQuery";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction";
  import ReactionEmoji from "../ReactionEmoji.svelte";
  import type { MediaReaction } from "../useMediaReactions";

  const {
    reactions,
    recent,
    mine,
    max,
    isReacting,
    onToggle,
  }: {
    reactions: MediaReaction[];
    recent: MediaReaction[];
    mine: UserMediaReaction[];
    max: number;
    isReacting: boolean;
    onToggle: (type: string) => void;
  } = $props();

  const heldTypes = $derived(new Set(mine.map((reaction) => reaction.type)));
  const isAtCap = $derived(mine.length >= max);
  const isDisabled = (type: string) =>
    isReacting || (isAtCap && !heldTypes.has(type));

  const used = $derived(reactions.filter((reaction) => reaction.count > 0));
  const unused = $derived(reactions.filter((reaction) => reaction.count === 0));

  const label = (type: string) =>
    m.button_label_react({ reaction: toTranslatedReaction(type) });
</script>

{#snippet emojiCell(reaction: MediaReaction, index: number)}
  <div
    class="emoji-cell"
    class:is-current={heldTypes.has(reaction.type)}
    style="--reaction-index: {index}"
  >
    <ActionButton
      label={label(reaction.type)}
      onclick={() => onToggle(reaction.type)}
      disabled={isDisabled(reaction.type)}
      style="ghost"
      tooltip={false}
    >
      <ReactionEmoji code={reaction.code} label={reaction.type} {index} />
    </ActionButton>
  </div>
{/snippet}

<div class="trakt-media-reaction-picker" class:is-loading={isReacting}>
  <div class="picker-inset">
    <header class="picker-header">
      <span class="bold secondary picker-title">
        <ReactionIcon state="default" />{m.header_react()}
      </span>
      <span class="secondary small">
        {m.text_reactions_selected({ count: mine.length, max })}
      </span>
    </header>

    {#if recent.length > 0}
      <p class="bold secondary small">{m.header_recent_reactions()}</p>
      <div class="emoji-grid">
        {#each recent as reaction, index (reaction.type)}
          {@render emojiCell(reaction, index)}
        {/each}
      </div>
    {/if}

    {#if used.length > 0}
      <hr class="picker-divider" />
      <div class="count-grid">
        {#each used as reaction, index (reaction.type)}
          <button
            class="count-cell"
            class:is-current={heldTypes.has(reaction.type)}
            style="--reaction-index: {index}"
            aria-label={label(reaction.type)}
            disabled={isDisabled(reaction.type)}
            onclick={() => onToggle(reaction.type)}
          >
            <ReactionEmoji code={reaction.code} label={reaction.type} {index} />
            <span class="count-value small">
              {toHumanNumber(reaction.count, getLocale())}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if unused.length > 0}
    <div class="picker-footer emoji-grid">
      {#each unused as reaction, index (reaction.type)}
        {@render emojiCell(reaction, index)}
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-media-reaction-picker {
    --animation-duration: calc(var(--transition-increment) * 2);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &.is-loading {
      .count-grid,
      .emoji-grid {
        opacity: 0.5;
      }
    }
  }

  .picker-inset {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-16);

    background: var(--color-reaction-distribution-background);
    border-radius: var(--border-radius-xxl);
  }

  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .picker-title {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .picker-divider {
    width: 100%;
    margin: 0;
    border: none;
    border-block-start: var(--border-thickness-xxs) solid
      var(--color-border-secondary);
  }

  .count-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ni-6);
  }

  .count-cell {
    all: unset;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    height: var(--ni-40);
    padding: 0 var(--ni-10) 0 var(--ni-8);
    box-sizing: border-box;

    background: var(--color-reaction-background);
    border-radius: var(--border-radius-m);

    opacity: 0;
    animation: bump-in var(--animation-duration) ease-in forwards;
    animation-delay: calc(var(--reaction-index) * var(--animation-duration) / 24);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color;

    &.is-current {
      background: var(--color-current-reaction-background);
    }

    &[disabled] {
      cursor: not-allowed;
      filter: saturate(0.5);
    }

    @include for-mouse {
      &:not([disabled]):hover {
        cursor: pointer;
        background: var(--color-current-reaction-hover);
      }
    }

    .count-value {
      margin-inline-start: auto;
      color: var(--color-text-secondary);
      font-variant-numeric: tabular-nums;
    }
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    justify-items: center;
    row-gap: var(--gap-xs);
  }

  .picker-footer {
    padding: var(--ni-8) var(--ni-8) var(--ni-4);
  }

  .emoji-cell {
    :global(.trakt-action-button) {
      border-radius: 50%;
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      opacity: 0;
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(
        var(--reaction-index) * var(--animation-duration) / 24
      );
    }

    &.is-current :global(.trakt-action-button) {
      background-color: var(--color-current-reaction-background);

      &:hover {
        background-color: var(--color-current-reaction-hover);
      }
    }
  }
</style>
