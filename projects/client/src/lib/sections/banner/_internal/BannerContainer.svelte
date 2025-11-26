<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-banner-container">
  <div class="trakt-banner-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-banner-container {
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    display: flex;
    justify-content: center;
  }

  .trakt-banner-content {
    width: 100%;
    max-width: var(--ni-920);
  }
</style>
