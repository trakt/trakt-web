<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { navigationTrap } from "$lib/features/navigation/navigationTrap";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { writable } from "$lib/utils/store/WritableSubject";
  import { onMount, type Snippet } from "svelte";
  import { slide } from "svelte/transition";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CloseIcon from "../icons/CloseIcon.svelte";
  import ListTitle from "../lists/_internal/ListTitle.svelte";
  import type { ListDrilldownLinkProps } from "../lists/section-list/models/ListDrilldownLinkProps";
  import { useDrawerPortal } from "./_internal/useDrawerPortal";
  import { verticalDrag } from "./_internal/verticalDrag";

  const drawerClass = "trakt-drawer";
  const HEADER_OVERLAY_FADE_DISTANCE = 16;

  type DrawerProps = {
    children: Snippet;
    onClose: () => void;
    title?: string;
    hasAutoClose?: boolean;
    trapSelector?: string;
    size?: "normal" | "large" | "auto";
    badge?: Snippet;
    actions?: Snippet;
    metaInfo?: string | Snippet;
    onOpened?: () => void;
    classList?: string;
    variant?: "default" | "vip";
    drilldown?: ListDrilldownLinkProps;
    headerVariant?: "default" | "overlay";
    // Raise this drawer (and its underlay) above a base-layer drawer, so a
    // drawer stacked on top of another still closes on outside tap.
    elevated?: boolean;
  };

  const {
    children,
    onClose,
    title,
    hasAutoClose = true,
    trapSelector,
    size = "normal",
    badge,
    actions,
    metaInfo,
    onOpened,
    classList = "",
    variant = "default",
    drilldown,
    headerVariant = "default",
    elevated = false,
  }: DrawerProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const slideAxis = $derived($isMobile ? "y" : "x");

  const { portal } = $derived(
    useDrawerPortal({ hasAutoClose, onClose, elevated }),
  );

  const trap = $derived((element: HTMLElement) => {
    if (trapSelector) {
      return navigationTrap(element, trapSelector);
    }
  });

  const isOpening = writable(false);
  let headerOverlayOpacity = $state(0);

  const updateHeaderOverlay = (event: Event) => {
    if (headerVariant !== "overlay") {
      return;
    }

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    headerOverlayOpacity = Math.min(
      target.scrollTop / HEADER_OVERLAY_FADE_DISTANCE,
      1,
    );
  };

  onMount(() => {
    if ($isOpening) {
      return;
    }

    onOpened?.();
  });
</script>

<div
  class={drawerClass}
  data-size={size}
  data-elevated={elevated}
  data-header-variant={headerVariant}
  style:--drawer-header-overlay-opacity={headerOverlayOpacity}
  transition:slide={{ duration: 150, axis: slideAxis }}
  use:portal
  use:trap
  use:appendClassList={classList}
  onintrostart={() => isOpening.set(true)}
  onintroend={() => {
    isOpening.set(false);
    onOpened?.();
  }}
>
  {#if variant === "vip"}
    <div class="trakt-drawer-vip-background"></div>
  {/if}

  <RenderFor audience="all" device={["mobile"]}>
    <div
      class="trakt-drawer-drag-handle"
      use:verticalDrag={{
        onClose,
        parentClass: drawerClass,
        fullscreenClass: "is-fullscreen",
        dragClass: "is-dragging",
        offsetVariable: "--drag-offset",
      }}
    >
      <div class="drag-indicator"></div>
    </div>
  </RenderFor>

  <div
    class="trakt-drawer-header"
    class:has-title={!!title}
    data-dpad-navigation={DpadNavigationType.List}
  >
    {#if title}
      <div class="trakt-drawer-title-container">
        <div class="trakt-drawer-title">
          {#if drilldown}
            <ListTitle {title} {drilldown} />
          {:else}
            <h1 class="ellipsis">{title}</h1>
          {/if}

          {#if metaInfo}
            {#if typeof metaInfo === "string"}
              <p class="title-meta-info bold ellipsis">{metaInfo}</p>
            {:else}
              {@render metaInfo()}
            {/if}
          {/if}
        </div>
        {@render badge?.()}
      </div>
    {/if}

    <div class="trakt-drawer-actions">
      {@render actions?.()}

      <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
        <ActionButton
          onclick={onClose}
          label={m.button_label_close()}
          style="ghost"
          navigationType={DpadNavigationType.Item}
          --color-foreground-default={headerVariant === "overlay"
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)"}
        >
          <CloseIcon />
        </ActionButton>
      </RenderFor>
    </div>
  </div>

  <div class="trakt-drawer-content" onscroll={updateHeaderOverlay}>
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-drawer {
    --drawer-size: var(--ni-380);
    --drawer-padding: var(--ni-16);
    --drawer-gap: var(--gap-m);
    --drawer-border-radius: var(--border-radius-xxl);
    --drawer-header-overlay-height: calc(
      var(--drawer-padding) * 2 + var(--ni-48)
    );
    --drawer-header-overlay-opacity: 0;

    touch-action: none;

    z-index: var(--layer-menu);
    position: fixed;
    box-sizing: border-box;

    // Stacked above a base-layer drawer; its underlay (layer-menu + 2) must
    // still sit below it so outside taps land on the underlay, not the drawer.
    &[data-elevated="true"] {
      z-index: calc(var(--layer-menu) + 3);
    }

    top: 0;
    bottom: 0;
    inset-inline-end: 0;

    width: var(--drawer-size);
    padding-top: var(--drawer-padding);
    padding-bottom: calc(
      var(--drawer-padding) + env(safe-area-inset-bottom, 0)
    );

    background: var(--color-drawer-background);

    box-shadow: var(--shadow-dialog);

    display: flex;
    flex-direction: column;
    gap: var(--drawer-gap);

    overflow: hidden;
    border-start-start-radius: var(--drawer-border-radius);
    border-end-start-radius: var(--drawer-border-radius);
    border-inline-start: var(--ni-1) solid var(--color-drawer-border);

    backdrop-filter: blur(var(--ni-12));

    &[data-header-variant="overlay"] {
      z-index: calc(var(--layer-menu) + 1);
      gap: 0;
      padding-top: 0;
      padding-bottom: 0;

      .trakt-drawer-header {
        position: absolute;
        z-index: var(--layer-top);
        top: 0;
        inset-inline: 0;
        align-items: flex-start;

        box-sizing: border-box;
        min-height: var(--drawer-header-overlay-height);
        padding-top: var(--drawer-padding);
        padding-bottom: var(--drawer-padding);
        pointer-events: none;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: var(--drawer-header-overlay-opacity);

          background: color-mix(
            in srgb,
            var(--color-drawer-background) 75%,
            transparent
          );
          backdrop-filter: blur(var(--ni-10));
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            color-mix(in srgb, black 99%, transparent) 10%,
            color-mix(in srgb, black 95%, transparent) 20%,
            color-mix(in srgb, black 89%, transparent) 30%,
            color-mix(in srgb, black 81%, transparent) 40%,
            color-mix(in srgb, black 71%, transparent) 50%,
            color-mix(in srgb, black 59%, transparent) 60%,
            color-mix(in srgb, black 45%, transparent) 70%,
            color-mix(in srgb, black 31%, transparent) 80%,
            color-mix(in srgb, black 16%, transparent) 90%,
            transparent 100%
          );
        }

        > * {
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }

        .trakt-drawer-title-container {
          align-items: flex-start;
        }

        :global(.trakt-action-button) {
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }
      }

      .trakt-drawer-content {
        padding-top: calc(var(--drawer-header-overlay-height) + var(--gap-xs));
        padding-bottom: 0;

        &::after {
          content: "";
          flex: 0 0
            calc(
              var(--drawer-padding) + var(--gap-m) +
                env(safe-area-inset-bottom, 0)
            );
        }
      }
    }

    &[data-size="large"] {
      --drawer-size: var(--ni-480);
    }

    &:has(.trakt-drawer-drag-handle) {
      padding-top: 0;

      &[data-header-variant="overlay"] {
        --drawer-drag-handle-height: calc(var(--ni-18) * 2 + var(--ni-4));

        .trakt-drawer-drag-handle {
          margin-bottom: 0;
        }

        .trakt-drawer-header {
          top: var(--drawer-drag-handle-height);
        }
      }
    }

    @include for-mobile {
      --mobile-drawer-height: var(--drawer-size);

      top: initial;
      inset-inline-start: 0;

      width: initial;
      height: calc(var(--mobile-drawer-height) - var(--drag-offset, 0px));

      border-end-start-radius: initial;
      border-start-end-radius: var(--drawer-border-radius);
      border-inline-start: none;
      border-top: var(--ni-1) solid var(--color-drawer-border);

      &:global(:not(.is-dragging)) {
        transition: height var(--transition-increment) ease-in-out;
      }

      &:global(.is-fullscreen),
      &[data-size="large"] {
        --mobile-drawer-height: calc(100dvh - env(safe-area-inset-top, 0px));
      }

      &[data-size="auto"] {
        --drawer-size: fit-content;
        max-height: calc(100dvh - env(safe-area-inset-top, 0px));

        &:global(.is-dragging) {
          --drawer-size: var(--initial-height);
        }
      }
    }
  }

  .trakt-drawer-drag-handle {
    display: flex;
    justify-content: center;
    touch-action: none;

    margin-bottom: calc(-1 * var(--drawer-gap));
    padding: var(--ni-18) 0;

    .drag-indicator {
      width: var(--ni-32);
      height: var(--ni-4);
      border-radius: var(--ni-2);

      background: var(--color-text-secondary);
    }
  }

  .trakt-drawer-title-container {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    flex: 1;
    min-width: 0;
  }

  .trakt-drawer-title {
    display: flex;
    flex-direction: column;

    min-width: 0;

    .title-meta-info {
      color: var(--list-meta-info-color);
    }
  }

  .trakt-drawer-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--gap-xs);

    &.has-title {
      justify-content: space-between;
    }
  }

  .trakt-drawer-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    flex-shrink: 0;
  }

  .trakt-drawer-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--gap-m);

    box-sizing: border-box;
    min-height: 0;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding-bottom: var(--ni-8);
    overscroll-behavior: contain;
  }

  .trakt-drawer-header,
  .trakt-drawer-content {
    padding-inline-start: var(--drawer-padding);
    padding-inline-end: var(--drawer-padding);
  }

  .trakt-drawer-vip-background {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;

    background: var(--background-vip-drawer);
    z-index: var(--layer-background);
  }
</style>
