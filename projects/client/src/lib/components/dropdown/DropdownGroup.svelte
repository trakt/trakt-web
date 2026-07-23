<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<ul class="trakt-dropdown-group">
  {@render children()}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // One elevated grouped card with flush, hairline-divided rows. Children are
  // DropdownItem `<li>`s; they arrive styled as filled pills, so their fill is
  // flattened here into flush rows via scoped overrides.
  .trakt-dropdown-group {
    all: unset;

    display: grid;
    grid-template-columns: 100%;

    background: var(--color-option-list-background);
    border: var(--ni-1) solid var(--color-option-list-border);
    border-radius: var(--border-radius-l);
    overflow: hidden;

    :global(li) {
      width: 100%;
      box-sizing: border-box;

      // Neutralise the filled-pill look; rows sit flush inside the card with a
      // single neutral foreground instead of the inverted flat-pill fill.
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
