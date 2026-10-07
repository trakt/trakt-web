<script lang="ts">
  import type { Snippet } from "svelte";

  const { year, children }: { year?: number; children: Snippet } = $props();
</script>

<div class="trakt-favorites-year-group">
  {#if year}
    <span class="year-group-label tag secondary">{year}</span>
  {/if}
  {@render children()}
</div>

<style lang="scss">
  .trakt-favorites-year-group {
    position: relative;

    padding-block-start: var(--height-year-label);

    .year-group-label {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      line-height: 1;

      &::after {
        content: "";
        flex: 1;

        height: var(--border-thickness-xxs);
        background: linear-gradient(
          to right,
          var(--color-text-secondary),
          transparent
        );
        transform: scaleX(var(--rtl-sign));
      }
    }
  }
</style>
