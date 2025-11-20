<script lang="ts">
  import SeasonalActionBarImage from "$lib/features/theme/components/SeasonalActionBarImage.svelte";
  import { useSeasonalTheme } from "$lib/features/theme/useSeasonalTheme";

  const { children }: ChildrenProps = $props();

  const { activeTheme } = useSeasonalTheme();
</script>

<div
  class="trakt-summary-actions"
  class:has-seasonal-theme={$activeTheme !== null}
>
  <SeasonalActionBarImage />
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    position: relative;

    height: var(--ni-56);
    width: var(--ni-280);

    padding: var(--ni-8) var(--ni-10);
    box-sizing: border-box;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--popup-shadow);

    :global(.trakt-popup-menu-button) {
      color: var(--color-text-primary);
    }

    :global(svg) {
      height: var(--ni-16);
    }

    &.has-seasonal-theme {
      margin-top: var(--ni-10);
    }

    @include for-tablet-sm-and-below {
      width: var(--summary-poster-width);
    }
  }
</style>
