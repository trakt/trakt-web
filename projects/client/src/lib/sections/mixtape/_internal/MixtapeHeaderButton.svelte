<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import type { MixtapeHeaderButtonProps } from "./MixtapeHeaderButtonProps.ts";

  const {
    href,
    label,
    isDisabled = false,
    replace = false,
    children,
  }: MixtapeHeaderButtonProps = $props();
</script>

<div class="trakt-mixtape-header-button" class:is-disabled={isDisabled}>
  {#if isDisabled}
    <ActionButton
      style="ghost"
      {label}
      disabled
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      {@render children()}
    </ActionButton>
  {:else}
    <ActionButton
      style="ghost"
      {label}
      {href}
      noscroll
      replacestate={replace}
      navigationType={DpadNavigationType.Item}
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      {@render children()}
    </ActionButton>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-header-button {
    display: inline-flex;
    opacity: 1;

    animation: mixtape-header-button-in calc(4 * var(--transition-increment))
      cubic-bezier(0.34, 1.3, 0.5, 1) var(--transition-increment) both;
    transition: opacity var(--transition-increment) ease-in-out;

    &.is-disabled {
      opacity: 0.25;
    }

    :global(.trakt-button[disabled]) {
      background: transparent;
    }

    @include for-mouse {
      :global(.trakt-button) {
        &:hover,
        &:focus-visible {
          --color-background-custom: var(--color-background);
        }
      }
    }
  }

  @keyframes mixtape-header-button-in {
    from {
      opacity: 0;
      transform: rotate(90deg);
    }
  }
</style>
