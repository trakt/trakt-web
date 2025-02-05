<script lang="ts">
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { slide } from "svelte/transition";
  import type { PopupMenuProps } from "./PopupMenuProps";
  import { usePortal } from "./_internal/usePortal";

  const { items, ...props }: PopupMenuProps = $props();

  const { portalTrigger, portal, isOpened } = usePortal();
</script>

<button
  use:disableTransitionOn={"touch"}
  use:portalTrigger
  aria-haspopup="true"
  class="trakt-popup-menu-button"
  {...props}
>
  <MoreIcon />
</button>

{#if $isOpened}
  <div
    use:portal
    class="trakt-popup-menu-container"
    transition:slide={{ duration: 150 }}
    onoutrostart={(e) => e.currentTarget.classList.add("removing")}
  >
    <div class="trakt-popup-menu-button-placeholder"><MoreIcon /></div>
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

  @mixin popup-button-style() {
    display: flex;
    align-items: center;
    justify-content: center;

    width: $button-size;
    height: $button-size;
    padding: $button-padding;

    border-radius: var(--border-radius-m);
    color: var(--shade-10);

    transition: var(--transition-increment) ease-in-out;
    transition-property: color, background-color, transform;

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .trakt-popup-menu-button {
    all: unset;

    @include popup-button-style();

    &:hover {
      background-color: var(--shade-10);
      color: var(--purple-900);
    }
  }

  :global(.trakt-popup-menu-container) {
    --list-padding: var(--ni-8);

    z-index: 777;
    position: absolute;

    min-width: var(--ni-156);
    padding: var(--list-padding);

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);

    box-shadow:
      var(--ni-0) var(--ni-4) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 8%, transparent 92%),
      var(--ni-0) var(--ni-16) var(--ni-16) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 7%, transparent 93%),
      var(--ni-0) var(--ni-32) var(--ni-20) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 4%, transparent 96%),
      var(--ni-0) var(--ni-60) var(--ni-24) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 1%, transparent 99%),
      var(--ni-0) var(--ni-95) var(--ni-32) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 0%, transparent 100%);

    ul {
      all: unset;

      display: grid;
      gap: var(--gap-xxs);

      :global(li) {
        width: 100%;
        box-sizing: border-box;
      }
    }

    div.spacer {
      height: calc($button-size + $button-padding * 2);
    }

    .trakt-popup-menu-button-placeholder {
      position: absolute;
      top: 0;
      left: 0;

      @include popup-button-style();

      animation: rotate-90 var(--transition-increment) ease-in;
      transform: rotate(90deg);

      color: var(--purple-900);
    }

    &[data-popup-direction="left"] {
      :global(.trakt-popup-menu-button-placeholder) {
        right: 0;
        left: auto;
      }
    }

    &[data-popup-direction="unaligned"] {
      :global(.trakt-popup-menu-button-placeholder) {
        display: none;
      }
    }

    &.removing {
      :global(.trakt-popup-menu-button-placeholder) {
        transform: rotate(0deg);
      }
    }
  }
</style>
