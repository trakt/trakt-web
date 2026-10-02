<script lang="ts">
  import { usePortal } from "$lib/features/portal/usePortal.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import type { ReactionsPopupProps } from "./ReactionsPopupProps.ts";

  const {
    trigger,
    children,
    reserve,
    offset = "0px",
  }: ReactionsPopupProps = $props();

  const { portalTrigger, portal, isOpened, close } = usePortal({
    placement: { position: "top" },
    type: "persistent",
  });

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const settle = $derived({
    start: $isReducedMotion ? 1 : 0,
    opacity: 0,
    easing: cubicOut,
  });
</script>

{@render trigger(portalTrigger, $isOpened)}

{#if $isOpened}
  <div
    class="trakt-reactions-popup"
    use:portal
    style:--reactions-popup-reserve={reserve}
    style:--reactions-popup-offset={offset}
  >
    <div
      class="reactions-popup-panel"
      in:scale={{ ...settle, duration: time.seconds(0.15) }}
      out:scale={{ ...settle, duration: time.seconds(0.3) }}
    >
      <div class="reactions-popup-content">
        {@render children(close)}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .trakt-reactions-popup {
    position: absolute;
    width: var(--ni-340);

    height: calc(
      var(--reactions-popup-reserve) + var(--reactions-popup-offset)
    );
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;

    &:global([data-popup-position="top"]) {
      padding-block-end: var(--reactions-popup-offset);
    }

    &:global([data-popup-position="bottom"]) {
      padding-block-start: var(--reactions-popup-offset);
      justify-content: flex-start;
    }
  }

  .reactions-popup-panel {
    pointer-events: auto;

    width: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-menu);
  }

  .reactions-popup-content {
    display: flex;
    flex-direction: inherit;
  }

  .trakt-reactions-popup:global([data-popup-position="top"])
    .reactions-popup-panel {
    transform-origin: calc(50% - var(--alignment-correction, 0px)) bottom;
  }

  .trakt-reactions-popup:global([data-popup-position="bottom"])
    .reactions-popup-panel {
    transform-origin: calc(50% - var(--alignment-correction, 0px)) top;
    flex-direction: column-reverse;
    --reaction-picker-direction: column-reverse;
  }
</style>
