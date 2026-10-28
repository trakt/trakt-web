<script lang="ts">
  import SeasonalActionBarMascot from "$lib/features/theme/components/SeasonalActionBarMascot.svelte";
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
  <SeasonalActionBarMascot />
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
    --actions-bar-height: var(--ni-56);
    --actions-bar-inset: calc((var(--actions-bar-height) - var(--ni-40)) / 2);
    --actions-bar-radius: calc(var(--actions-bar-height) / 2);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    position: relative;

    height: var(--actions-bar-height);
    width: var(--ni-280);

    padding: var(--actions-bar-inset);
    box-sizing: border-box;

    background-color: var(--color-actions-bar-background);
    border-radius: var(--actions-bar-radius);
    box-shadow: var(--shadow-raised);

    transition: border-radius var(--popup-transition-duration) ease-in-out;
    transition-delay: calc(var(--popup-transition-duration) / 2);

    :global(.trakt-popup-menu-button) {
      color: var(--color-text-primary);
    }

    :global(svg:not(:where([data-seasonal-decoration] *))) {
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
      width: var(--summary-poster-width);
      &:global(:has(.trakt-media-actions-popup-button.is-opened)) {
        border-radius: var(--actions-bar-radius);
      }
    }
  }
</style>
