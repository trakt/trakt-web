<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="trakt-app-card">
  {@render children()}
</div>

<style lang="scss">
  .trakt-app-card {
    display: flex;
    flex-direction: column;

    border-radius: var(--border-radius-l);
    overflow: hidden;

    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    :global(.trakt-app-row:not(:last-child)) {
      border-bottom: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 10%, transparent);
    }
  }
</style>
