<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { slide } from "svelte/transition";
  import type { PopupMenuProps } from "./PopupMenuProps";
  import { usePopupMenu } from "./_internal/usePopupMenu";

  const {
    items,
    mode = "overlay",
    size = "small",
    icon,
    label,
    title,
    ...props
  }: PopupMenuProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const variant = $derived($isMobile ? "drawer" : "portal");

  const { menuTrigger, portal, isOpened, close } = $derived(
    usePopupMenu({ variant }),
  );
</script>

{#key variant}
  <button
    use:disableTransitionOn={"touch"}
    use:menuTrigger
    aria-haspopup="true"
    aria-label={label}
    aria-expanded={$isOpened}
    class="trakt-popup-menu-button"
    data-mode={mode}
    data-size={size}
    data-variant={variant}
    class:has-custom-icon={!!icon}
    class:has-drawer-open={$isOpened && variant === "drawer"}
    {...props}
  >
    {#if icon}
      {@render icon()}
    {:else}
      <MoreIcon {size} />
    {/if}
  </button>
{/key}

{#if variant === "drawer"}
  {#if $isOpened}
    <Drawer onClose={close} {title} size="auto">
      <ul class="popup-menu-card">
        {@render items()}
      </ul>
    </Drawer>
  {/if}
{:else}
  {#if $isOpened}
    <div
      use:portal
      class="trakt-popup-menu-container"
      transition:slide={{ duration: 150 }}
    >
      <div class="spacer"></div>
      <ul class="popup-menu-card">
        {@render items()}
      </ul>
    </div>
  {/if}
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

    &[data-size="normal"] {
      width: var(--ni-32);
      height: var(--ni-32);
    }

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
    }

    &:not(:disabled) {
      --active-background-color: var(--shade-10);
      --active-color: var(--purple-900);

      &[data-popup-state="opened"] {
        background-color: var(--active-background-color);
        color: var(--active-color);
      }

      @include for-mouse() {
        &:hover {
          background-color: var(--active-background-color);
          color: var(--active-color);
        }

        &[data-mode="standalone"]:not([data-popup-state="opened"]):hover {
          color: var(--color-text-primary);
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 10%,
            transparent
          );
        }
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

    &.has-drawer-open,
    &[data-popup-state="opened"] {
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

    position: absolute;

    .popup-menu-card {
      max-height: var(--ni-220);
      overflow-y: auto;
      box-shadow: var(--shadow-menu);
    }

    div.spacer {
      height: calc($button-size + $button-padding * 2 + var(--list-padding));
    }
  }

  // Grouped card: one elevated surface with hairline-divided rows, shared by
  // the mobile drawer and the desktop portal. PopupMenu receives its items as
  // an opaque snippet, so the child DropdownItems are flattened from filled
  // pills into flush rows via scoped overrides here.
  .popup-menu-card {
    all: unset;

    display: grid;
    grid-template-columns: 100%;

    background: var(--color-option-list-background);
    border-radius: var(--border-radius-l);
    overflow: hidden;

    :global(li) {
      width: 100%;
      box-sizing: border-box;

      // Neutralise the filled-pill look; rows sit flush inside the card with
      // a single neutral foreground instead of the inverted flat-pill fill.
      background: transparent !important;
      border-radius: 0 !important;
      height: auto !important;
      padding: var(--ni-14) var(--ni-16) !important;
      color: var(--color-text-primary) !important;
    }

    // Destructive actions keep their red as a safety cue.
    :global(li[data-color="red"]) {
      color: var(--red-600) !important;
    }

    :global(li:not(:last-child)) {
      border-block-end: var(--ni-1) solid var(--color-option-list-separator);
    }

    // Subtle highlight on hover/press, matching the selected-row treatment.
    @include for-mouse {
      :global(li:hover) {
        background: var(--color-option-list-highlight) !important;
      }
    }

    :global(li:active) {
      background: var(--color-option-list-highlight) !important;
    }
  }
</style>
