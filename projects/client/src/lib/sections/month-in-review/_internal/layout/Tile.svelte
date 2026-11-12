<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    span = 6,
    variant = "filled",
    children,
  }: {
    span?: 2 | 3 | 4 | 6;
    variant?: "filled" | "outlined";
    children: Snippet;
  } = $props();
</script>

<div class="trakt-month-review-tile" data-span={span} data-variant={variant}>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-tile {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    min-width: 0;
    padding: var(--gap-l);
    border-radius: var(--border-radius-xl);
    grid-column: span 6;

    &[data-variant="filled"] {
      background: var(--color-card-background);
      box-shadow: var(--shadow-base);
    }

    &[data-variant="outlined"] {
      box-shadow: inset 0 0 0 1px var(--color-month-review-track);
    }

    &[data-span="2"] {
      grid-column: span 2;
    }

    &[data-span="3"] {
      grid-column: span 3;
    }

    &[data-span="4"] {
      grid-column: span 4;
    }

    @include for-tablet-sm-and-below {
      &[data-span] {
        grid-column: 1 / -1;
      }
    }

    @include for-mobile {
      padding: var(--gap-m);
    }
  }
</style>
