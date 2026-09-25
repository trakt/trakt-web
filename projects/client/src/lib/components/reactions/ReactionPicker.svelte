<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import type { ReactionPickerProps } from "./ReactionPickerProps.ts";

  /*
    THE reaction picker. One control, one taxonomy, both surfaces.

    It started as `comment-actions/ReactionPicker`, sealed inside the comment
    stack. Reacting to a title is the same control doing the same job on the
    same vocabulary, so it moves here rather than being written a second time
    one folder over.

    The one layout difference is an option, not a component: `onClose` adds the
    leading dismiss button, for a picker that opens in a bar it has to dismiss
    itself rather than inside a popover that dismisses it.
  */
  const { options, chosen, onSelect, onClose }: ReactionPickerProps = $props();
</script>

<div class="trakt-reaction-picker">
  {#if onClose}
    <ActionButton
      label={m.button_label_close_reaction()}
      onclick={onClose}
      style="ghost"
    >
      <CloseIcon />
    </ActionButton>
  {/if}

  {#each options as option, index (option.id)}
    <div
      class="picker-cell"
      class:is-chosen={chosen === option.id}
      style="--reaction-index: {index}"
    >
      <ActionButton
        label={m.button_label_react({ reaction: option.label })}
        onclick={() => onSelect(option.id)}
        style="ghost"
      >
        <ReactionEmoji
          code={option.code}
          label={option.label}
          {index}
          animation="initial"
        />
      </ActionButton>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    No width or box of its own: whatever opens this - a comment bar, a popover
    - is definitely sized, and sets its own padding around this.
  */
  .trakt-reaction-picker {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);

      color: var(--color-foreground);
    }
  }

  .picker-cell {
    --animation-duration: calc(var(--transition-increment) * 2);

    border-radius: 50%;

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      border-radius: 50%;

      opacity: 0;

      --delay-factor: calc(var(--animation-duration) / 6);
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(var(--reaction-index) * var(--delay-factor));
    }

    /*
      The current pick, held lit. Theme tokens rather than a brand colour: the
      app ships FREE, VIP and DIRECTOR tier palettes, and a hardcoded purple
      ring stayed purple under all three.
    */
    &.is-chosen :global(.trakt-action-button) {
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
