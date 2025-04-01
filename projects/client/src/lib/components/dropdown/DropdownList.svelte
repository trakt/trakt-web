<script lang="ts">
  import { slide } from "svelte/transition";
  import { usePortal } from "../../features/portal/usePortal.ts";
  import Button from "../buttons/Button.svelte";
  import DropdownIcon from "./DropdownCaretIcon.svelte";
  import type { TraktDropdownListProps } from "./TraktDropdownListProps.ts";
  import { useWidthObserver } from "./_internal/useWidthObserver.ts";

  const {
    icon: _icon,
    children,
    items,
    size,
    ...props
  }: TraktDropdownListProps = $props();

  const { portalTrigger, portal, isOpened } = usePortal();

  const { observedWidth, observeWidth } = useWidthObserver();
</script>

<div
  class="trakt-dropdown-wrapper"
  use:portalTrigger
  use:observeWidth
  data-size={size}
>
  <Button style="textured" {size} {...props}>
    {@render children()}
    {#snippet icon()}
      <div class="trakt-dropdown-list-icon">
        {#if _icon != null}
          {@render _icon()}
        {/if}
        <DropdownIcon open={$isOpened} disabled={props.disabled} />
      </div>
    {/snippet}
  </Button>
</div>

{#if $isOpened}
  <div
    class="trakt-list"
    data-size={size}
    style="--button-width: {$observedWidth}px"
    transition:slide={{ duration: 150 }}
    use:portal
  >
    <div class="spacer"></div>
    <ul>
      {@render items()}
    </ul>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-dropdown-wrapper {
    display: flex;

    :global(.trakt-button) {
      flex-grow: 1;
    }

    &[data-size="small"] {
      :global(.trakt-button) {
        min-width: fit-content;
      }

      .trakt-dropdown-list-icon {
        :global(.trakt-dropdown-caret) {
          width: var(--ni-12);
          height: var(--ni-12);
        }
      }
    }

    &:global([data-popup-state="opened"]) {
      :global(.trakt-dropdown-caret) {
        transform: rotate(180deg);
        animation: rotate-180 var(--transition-increment) ease-in;
      }
    }

    .trakt-dropdown-list-icon {
      display: flex;
      gap: var(--gap-s);
    }

    :global(.trakt-button[disabled]:active) {
      :global(.trakt-dropdown-list-icon .trakt-dropdown-list-caret) {
        animation: loopy-loop var(--animation-duration-loopy-loop) infinite;
      }
    }
  }

  .trakt-list {
    --list-padding: var(--ni-12);

    transform: translateY(calc(-1 * var(--list-padding)))
      translateX(var(--list-padding));

    min-width: var(--button-width);
    padding: var(--list-padding);

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);

    div.spacer {
      height: calc(var(--ni-40) + var(--list-padding) * 2);
    }

    ul {
      all: unset;

      display: grid;
      max-height: var(--ni-220);
      overflow-y: auto;

      @include for-mouse {
        &::-webkit-scrollbar {
          width: var(--ni-8);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--shade-300);
          border-radius: var(--border-radius-xs);
          backdrop-filter: blur(var(--ni-4));
        }
      }
    }

    &[data-size="small"] {
      // TODO change back to transform scale when scaling is fixed
      --small-padding: var(--ni-10);

      transform: translateY(calc(-1 * var(--small-padding)))
        translateX(var(--small-padding));

      padding: var(--small-padding);

      :global(li) {
        padding: 0 var(--small-padding);
        height: calc(var(--ni-16) + var(--small-padding) * 2);
        width: calc(100% - var(--small-padding) * 2);
      }

      :global(li p) {
        font-size: var(--ni-12);
      }

      div.spacer {
        height: calc(var(--ni-24) + var(--small-padding) * 2);
      }
    }
  }
</style>
