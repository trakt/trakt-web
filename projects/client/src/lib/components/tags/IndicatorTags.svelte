<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-indicator-tags-container">
  <div class="trakt-indicator-tags">
    {@render children()}
  </div>
</div>

<style>
  /* To make sure Firefox can position it properly */
  .trakt-indicator-tags-container {
    position: relative;
  }

  .trakt-indicator-tags {
    z-index: var(--layer-raised);

    position: absolute;
    width: var(--width-override-card, var(--width-card, 100%));

    bottom: 0;
    transform: translateY(50%);

    display: inline-flex;
    justify-content: center;
    gap: var(--gap-xxs);
  }
</style>
