<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    id,
    headerForeground = "poster",
    spacious = false,
    children,
  }: {
    /** DOM id for the page root (e.g. "year-in-review"). */
    id: string;
    /**
     * "poster" keeps the fixed header text white over the dark poster hero;
     * "theme" tracks the theme so it stays legible over a light hero.
     */
    headerForeground?: "poster" | "theme";
    /** Adds bottom breathing room so the last card isn't flush (MIR). */
    spacious?: boolean;
    children: Snippet;
  } = $props();
</script>

<div
  {id}
  class="trakt-review-page"
  class:is-spacious={spacious}
  data-header-foreground={headerForeground}
>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-review-page {
    display: flex;
    flex-direction: column;

    // Pull up under the hidden navbar's safe-area spacer
    margin-top: calc(-1 * env(safe-area-inset-top, 0));
    min-height: calc(100dvh + env(safe-area-inset-top, 0));

    background-color: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    overflow-x: hidden;

    --color-yir-header-foreground: var(--color-yir-poster-foreground);

    // Account for the side navbar's outer margin (gap-s on each side) so the
    // visible gap on the right of the navbar matches the gap on the left.
    --layout-sidebar-distance: calc(
      var(--side-navbar-width) + 2 * var(--gap-s)
    );

    @include for-tablet-sm-and-below {
      --layout-sidebar-distance: 0;
    }

    &[data-header-foreground="theme"] {
      --color-yir-header-foreground: var(--color-yir-text-primary);
    }

    &.is-spacious {
      padding-bottom: var(--ni-104);

      @include for-mobile {
        padding-bottom: var(--ni-72);
      }
    }
  }
</style>
