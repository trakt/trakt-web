<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";

  const { href, isDisabled }: { href: string; isDisabled: boolean } = $props();
</script>

<div class="trakt-mixtape-restart" class:is-disabled={isDisabled}>
  {#if isDisabled}
    <ActionButton
      style="ghost"
      label={m.button_text_mixtape_start_over()}
      disabled
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      <ResetFiltersIcon />
    </ActionButton>
  {:else}
    <ActionButton
      style="ghost"
      label={m.button_text_mixtape_start_over()}
      {href}
      noscroll
      replacestate
      navigationType={DpadNavigationType.Item}
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      <ResetFiltersIcon />
    </ActionButton>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-restart {
    display: inline-flex;
    opacity: 1;

    animation: mixtape-restart-in calc(4 * var(--transition-increment))
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

  @keyframes mixtape-restart-in {
    from {
      opacity: 0;
      transform: rotate(90deg);
    }
  }
</style>
