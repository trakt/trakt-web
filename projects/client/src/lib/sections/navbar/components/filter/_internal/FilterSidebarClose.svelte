<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus.ts";

  const {
    anchor,
    isVisible,
    onClose,
  }: {
    anchor: HTMLElement | undefined;
    isVisible: boolean;
    onClose: () => void;
  } = $props();

  let position = $state({ top: 0, left: 0 });

  const measure = () => {
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    position = { top: rect.top, left: rect.left };
  };

  $effect(() => {
    anchor;
    isVisible;

    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  });

  const portal = (element: HTMLElement) => {
    document.body.appendChild(element);
    measure();

    const unregisterResize = GlobalEventBus.getInstance().register(
      "resize",
      measure,
    );

    return {
      destroy: () => {
        unregisterResize();
        element.remove();
      },
    };
  };
</script>

<div
  class="trakt-filter-sidebar-close"
  class:is-visible={isVisible}
  style:top="{position.top}px"
  style:left="{position.left}px"
  inert={!isVisible}
  use:portal
>
  <ActionButton
    style="ghost"
    label={m.button_label_close()}
    navigationType={DpadNavigationType.Item}
    onclick={onClose}
    --color-background-custom="transparent"
    --color-foreground-custom="var(--color-foreground)"
  >
    <CloseIcon />
  </ActionButton>
</div>

<style>
  .trakt-filter-sidebar-close {
    position: fixed;
    z-index: calc(var(--layer-menu) + 1);

    opacity: 0;
    transform: rotate(-90deg) scale(0.6);
    pointer-events: none;

    transition: calc(2 * var(--transition-increment)) ease-in-out;
    transition-property: opacity, transform;

    &.is-visible {
      opacity: 1;
      transform: none;
      pointer-events: auto;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
</style>
