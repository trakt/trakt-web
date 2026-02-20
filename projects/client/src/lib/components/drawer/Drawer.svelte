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
  import { useDrawerPortal } from "./_internal/useDrawerPortal";
  import { verticalDrag } from "./_internal/verticalDrag";

  const DRAWER_CLASS = "trakt-drawer";

  type DrawerProps = {
    onClose: () => void;
    title?: string;
    hasAutoClose?: boolean;
    trapSelector?: string;
    size?: "normal" | "large" | "auto";
    badge?: Snippet;
    metaInfo?: string;
    onOpened?: () => void;
    classList?: string;
    variant?: "default" | "vip";
  } & ChildrenProps;

  const {
    children,
    onClose,
    title,
    hasAutoClose = true,
    trapSelector,
    size = "normal",
    badge,
    metaInfo,
    onOpened,
    classList = "",
    variant = "default",
  }: DrawerProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const slideAxis = $derived($isMobile ? "y" : "x");

  const { portal } = $derived(useDrawerPortal({ hasAutoClose, onClose }));

  const trap = $derived((element: HTMLElement) => {
    if (trapSelector) {
      return navigationTrap(element, trapSelector);
    }
  });

  const isOpening = writable(false);
  onMount(() => {
    if ($isOpening) {
      return;
    }

    onOpened?.();
  });
</script>

<div
  class={DRAWER_CLASS}
  data-size={size}
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
        parentClass: DRAWER_CLASS,
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
          <h1 class="ellipsis">{title}</h1>
          {#if metaInfo}
            <p class="title-meta-info bold ellipsis">{metaInfo}</p>
          {/if}
        </div>
        {@render badge?.()}
      </div>
    {/if}

    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <ActionButton
        onclick={onClose}
        label={m.button_label_close()}
        style="ghost"
        navigationType={DpadNavigationType.Item}
        --color-foreground-default="var(--color-text-secondary)"
      >
        <CloseIcon />
      </ActionButton>
    </RenderFor>
  </div>

  <div class="trakt-drawer-content">
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

    touch-action: none;

    z-index: var(--layer-menu);
    position: fixed;
    box-sizing: border-box;

    top: 0;
    bottom: 0;
    right: 0;

    width: var(--drawer-size);
    padding-top: var(--drawer-padding);
    padding-bottom: calc(
      var(--drawer-padding) + env(safe-area-inset-bottom, 0)
    );

    background: var(--color-drawer-background);

    box-shadow: var(--ni-0) var(--ni-0) var(--ni-24) var(--ni-12)
      color-mix(in srgb, var(--color-shadow) 50%, transparent);

    display: flex;
    flex-direction: column;
    gap: var(--drawer-gap);

    overflow: hidden;
    border-top-left-radius: var(--drawer-border-radius);
    border-bottom-left-radius: var(--drawer-border-radius);
    border-left: var(--ni-1) solid var(--color-drawer-border);

    backdrop-filter: blur(var(--ni-12));

    &[data-size="large"] {
      --drawer-size: var(--ni-480);
    }

    &:has(.trakt-drawer-drag-handle) {
      padding-top: 0;
    }

    @include for-mobile {
      --mobile-drawer-height: var(--drawer-size);

      top: initial;
      left: 0;

      width: initial;
      height: calc(var(--mobile-drawer-height) - var(--drag-offset, 0px));

      border-bottom-left-radius: initial;
      border-top-right-radius: var(--drawer-border-radius);
      border-left: none;
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

  .trakt-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    overflow-y: auto;
    padding-bottom: var(--ni-8);
    overscroll-behavior: contain;
  }

  .trakt-drawer-header,
  .trakt-drawer-content {
    padding-left: var(--drawer-padding);
    padding-right: var(--drawer-padding);
  }

  .trakt-drawer-vip-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: var(--background-vip-drawer);
    z-index: var(--layer-background);
  }
</style>
