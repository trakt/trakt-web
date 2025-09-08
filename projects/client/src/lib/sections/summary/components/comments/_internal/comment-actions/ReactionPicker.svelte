<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants";

  const {
    currentReaction,
    onChange,
    onClose,
  }: {
    currentReaction: Reaction | Nil;
    onChange: (reaction: Reaction) => void;
    onClose: () => void;
  } = $props();
</script>

<div class="trakt-reaction-picker">
  <ActionButton
    label={m.button_label_close_reaction()}
    onclick={onClose}
    style="ghost"
  >
    <CloseIcon />
  </ActionButton>

  {#each Object.entries(REACTIONS_CODE_MAP) as [reaction, code], index (reaction)}
    <div
      class="trakt-react-button-container"
      class:is-current={currentReaction === reaction}
      style="--reaction-index: {index}"
    >
      <ActionButton
        label={m.button_label_react({
          reaction: toTranslatedValue("reaction", reaction),
        })}
        onclick={() => onChange(reaction as Reaction)}
        style="ghost"
      >
        <ReactionEmoji {code} label={reaction} {index} animation="initial" />
      </ActionButton>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-picker {
    display: flex;
    align-items: center;
    height: var(--ni-40);
    margin: var(--ni-8);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);

      color: var(--color-foreground);
    }
  }

  .trakt-react-button-container {
    --animation-duration: calc(var(--transition-increment) * 2);

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      border-radius: 50%;

      background-color: transparent;
      backdrop-filter: none;

      opacity: 0;

      --delay-factor: calc(var(--animation-duration) / 6);
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(var(--reaction-index) * var(--delay-factor));
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
