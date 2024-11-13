<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="episode-footer">
  {@render children()}
</div>

<style>
  .episode-footer {
    display: flex;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
