<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-card-bottom-bar">
  {@render children()}
</div>

<style>
  .trakt-summary-card-bottom-bar {
    --poster-width: calc(
      var(--height-summary-card-cover) * var(--poster-aspect-ratio, 0)
    );

    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(100% - var(--poster-width));

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    padding: var(--ni-12);
    box-sizing: border-box;

    z-index: var(--layer-floating);
  }
</style>
