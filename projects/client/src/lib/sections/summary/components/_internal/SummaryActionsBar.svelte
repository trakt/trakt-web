<script lang="ts">
  import SeasonalActionBarImage from "$lib/features/theme/components/SeasonalActionBarImage.svelte";
  import { useSeasonalTheme } from "$lib/features/theme/useSeasonalTheme";
  import type { Snippet } from "svelte";
  import SummaryActionsPopup from "./SummaryActionsPopup.svelte";

  const sliderTransitionMs = 150;

  type SummaryPopupProps = {
    actions: Snippet;
    title: string;
    metaInfo?: string;
  };

  const { children, popup }: ChildrenProps & { popup?: SummaryPopupProps } =
    $props();

  const { activeTheme } = useSeasonalTheme();
</script>

<div
  class="trakt-summary-actions-bar"
  class:has-seasonal-theme={$activeTheme !== null}
  style="--popup-transition-duration: {sliderTransitionMs}ms"
>
  <SeasonalActionBarImage />
  {@render children()}

  {#if popup}
    <SummaryActionsPopup
      title={popup.title}
      metaInfo={popup.metaInfo}
      transitionDuration={sliderTransitionMs}
    >
      {@render popup.actions()}
    </SummaryActionsPopup>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    position: relative;

    height: var(--summary-actions-bar-height, var(--ni-56));
    // Configurable so a container can stretch the tray to its own measure - the
    // revamped header's poster rail fills its 264px column.
    width: var(--summary-actions-bar-width, var(--ni-280));

    /*
      Configurable, so a container can nest its controls concentrically. The
      default is asymmetric (8 vertical, 10 horizontal) which reads as extra room
      down one side once the controls fill the tray's height.
    */
    padding: var(--summary-actions-bar-padding, var(--ni-8) var(--ni-10));
    box-sizing: border-box;

    background-color: var(--color-actions-bar-background);
    border-radius: var(--border-radius-l);
    /*
      Configurable so a caller can opt out of the lift. On a flat surface the raised
      shadow reads as a halo around the tray rather than as elevation.
    */
    box-shadow: var(--summary-actions-bar-shadow, var(--shadow-raised));

    transition: border-radius var(--popup-transition-duration) ease-in-out;
    transition-delay: calc(var(--popup-transition-duration) / 2);

    :global(.trakt-popup-menu-button) {
      color: var(--color-text-primary);
    }

    :global(svg) {
      height: var(--ni-16);
    }

    &.has-seasonal-theme {
      margin-top: var(--ni-10);
    }

    &:global(:has(.trakt-media-actions-popup-button.is-opened)) {
      border-end-start-radius: 0;
      border-end-end-radius: 0;
      transition-delay: 0s;
    }

    @include for-tablet-sm-and-below {
      /*
        The configured width must keep winning here. Without it, a caller that
        configures the tray (e.g. fit-content) got the poster width only below
        tablet-sm - wider than its desktop size, so the tray grew as the window
        shrank. Unconfigured callers keep matching the poster, as shipped.
      */
      width: var(--summary-actions-bar-width, var(--summary-poster-width));
      &:global(:has(.trakt-media-actions-popup-button.is-opened)) {
        border-radius: var(--border-radius-l);
      }
    }
  }
</style>
