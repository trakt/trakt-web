<script lang="ts">
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import { usePortal } from "$lib/features/portal/usePortal";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { slide } from "svelte/transition";
  import type { PopupMenuProps } from "./PopupMenuProps";

  const { items, mode = "overlay", icon, ...props }: PopupMenuProps = $props();

  const { portalTrigger, portal, isOpened } = usePortal();
</script>

<button
  use:disableTransitionOn={"touch"}
  use:portalTrigger
  aria-haspopup="true"
  class="trakt-popup-menu-button"
  data-mode={mode}
  class:has-custom-icon={!!icon}
  {...props}
>
  {#if icon}
    {@render icon()}
  {:else}
    <MoreIcon />
  {/if}
</button>

{#if $isOpened}
  <div
    use:portal
    class="trakt-popup-menu-container"
    transition:slide={{ duration: 150 }}
  >
    <div class="spacer"></div>
    <ul>
      {@render items()}
    </ul>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  $button-size: var(--ni-24);
  $button-padding: var(--ni-4);

  .trakt-popup-menu-button {
    all: unset;
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: $button-size;
    height: $button-size;
    padding: $button-padding;
    flex-shrink: 0;

    border-radius: var(--border-radius-m);
    color: var(--shade-10);

    transition: var(--transition-increment) ease-in-out;
    transition-property: color, background-color, transform;

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    :global(svg) {
      transition: transform var(--transition-increment) ease-in-out;
    }

    &[data-mode="standalone"] {
      color: var(--color-text-primary);
    }

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
    }

    &:not(:disabled) {
      &:hover,
      &[data-popup-state="opened"] {
        background-color: var(--shade-10);
        color: var(--purple-900);
      }
    }

    &:active {
      &[disabled] {
        animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle)
          infinite;
      }
    }

    @include for-touch {
      &::after {
        position: absolute;
        content: "";
        width: 175%;
        height: 175%;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
      }
    }

    &:not(.has-custom-icon)[data-popup-state="opened"] {
      :global(svg) {
        transform: rotate(90deg);
        animation: rotate-90 var(--transition-increment) ease-in;
      }

      &:global([data-popup-alignment="unaligned"]) {
        display: none;
      }
    }
  }

  .trakt-popup-menu-container {
    --list-padding: var(--ni-8);

    min-width: var(--ni-156);
    max-width: var(--ni-240);
    padding: var(--list-padding);

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);

    position: absolute;
    box-shadow: var(--popup-shadow);

    ul {
      all: unset;

      display: grid;
      grid-template-columns: 100%;
      gap: var(--gap-xxs);
      max-height: var(--ni-220);
      overflow-y: auto;

      :global(li) {
        width: 100%;
        box-sizing: border-box;
      }
    }

    div.spacer {
      height: calc($button-size + $button-padding * 2 + var(--list-padding));
    }
  }
</style>
