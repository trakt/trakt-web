<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-episode">
  <div class="episode-card">
    {@render children()}
  </div>
</div>

<style>
  .episode-card {
    width: 12.5rem;

    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: 0px 4px 8px 0px
      color-mix(in srgb, var(--color-card-background) 25%, transparent 75%);
  }
</style>
