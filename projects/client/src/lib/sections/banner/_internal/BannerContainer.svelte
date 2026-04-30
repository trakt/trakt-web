<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    action,
    variant = "default",
  }: ChildrenProps & {
    variant?: "default" | "fluid";
    action?: Snippet;
  } = $props();
</script>

<div class="trakt-banner-container" data-variant={variant}>
  {#if action}
    <div class="trakt-banner-action">
      {@render action()}
    </div>
  {/if}
  <div class="trakt-banner-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-banner-container {
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    gap: var(--gap-xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trakt-banner-content {
    width: 100%;
    max-width: var(--ni-920);
  }

  .trakt-banner-container[data-variant="fluid"] .trakt-banner-content {
    max-width: none;
  }

  .trakt-banner-action {
    flex-shrink: 0;
  }
</style>
