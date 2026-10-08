<script lang="ts" generics="T extends string">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import type { ReactionPickerCellProps } from "./ReactionPickerCellProps.ts";

  const {
    option,
    index,
    chosen,
    limit,
    onSelect,
    size = "normal",
  }: ReactionPickerCellProps<T> = $props();

  const isChosen = $derived(chosen.includes(option.id));
  const isDisabled = $derived(
    !isChosen && limit != null && chosen.length >= limit,
  );

  let isPressed = $state(false);

  function pressHandler() {
    isPressed = false;
    requestAnimationFrame(() => (isPressed = true));

    onSelect(option.id);
  }

  function animationEndHandler(event: AnimationEvent) {
    if (!event.animationName.endsWith("reaction-press")) return;

    isPressed = false;
  }
</script>

<div
  class="picker-cell"
  class:is-chosen={isChosen}
  class:is-large={size === "large"}
  class:is-pressed={isPressed}
  style="--reaction-index: {index}"
  onanimationend={animationEndHandler}
>
  <ActionButton
    label={m.button_label_react({ reaction: option.label })}
    onclick={pressHandler}
    disabled={isDisabled}
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .picker-cell {
    &.is-pressed :global(.trakt-reaction-emoji-container) {
      animation: reaction-press calc(var(--transition-increment) * 2) ease-out;
    }

    &.is-large {
      --reaction-emoji-box: var(--ni-36);
      --reaction-emoji-size: var(--ni-28);
    }

    --animation-duration: calc(var(--transition-increment) * 2);

    :global(.trakt-reaction-emoji-container) {
      transition: var(--transition-increment) ease-out;
      transition-property: opacity, filter;
    }

    :global(.trakt-action-button[disabled] .trakt-reaction-emoji-container) {
      opacity: 0.35;
      filter: grayscale(1);
    }

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      border-radius: 50%;

      opacity: 0;

      --delay-factor: calc(var(--animation-duration) / 6);
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(var(--reaction-index) * var(--delay-factor));
    }

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
  @keyframes reaction-press {
    30% {
      transform: scale(0.8);
    }

    65% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
