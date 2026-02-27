<script lang="ts">
  import SeasonalActionBarImage from "$lib/features/theme/components/SeasonalActionBarImage.svelte";
  import { useSeasonalTheme } from "$lib/features/theme/useSeasonalTheme";
  import type { Snippet } from "svelte";
  import SummaryActionsPopup from "./SummaryActionsPopup.svelte";

  const SLIDER_TRANSITION_MS = 150;

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
  style="--popup-transition-duration: {SLIDER_TRANSITION_MS}ms"
>
  <SeasonalActionBarImage />
  {@render children()}

  {#if popup}
    <SummaryActionsPopup
      title={popup.title}
      metaInfo={popup.metaInfo}
      transitionDuration={SLIDER_TRANSITION_MS}
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

    height: var(--ni-56);
    width: var(--ni-280);

    padding: var(--ni-8) var(--ni-10);
    box-sizing: border-box;

    background-color: var(--color-actions-bar-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-raised);

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
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      transition-delay: 0s;
    }

    @include for-tablet-sm-and-below {
      width: var(--summary-poster-width);
      &:global(:has(.trakt-media-actions-popup-button.is-opened)) {
        border-radius: var(--border-radius-l);
        clip-path: none;
      }
    }
  }
</style>
