<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-banner-container">
  {@render children()}
</div>

<style>
  .trakt-banner-container {
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);
  }
</style>
