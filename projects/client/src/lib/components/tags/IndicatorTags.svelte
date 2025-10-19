<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-indicator-tags">
  {@render children()}
</div>

<style>
  .trakt-indicator-tags {
    z-index: var(--layer-raised);

    position: absolute;
    width: 100%;

    bottom: var(--ni-neg-10);

    display: inline-flex;
    justify-content: center;
    gap: var(--gap-xxs);
  }
</style>
