<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-tag">
  {@render children()}
</div>

<style>
  .trakt-tag {
    display: flex;
    align-items: center;

    height: 0.875rem;
    line-height: 0.875rem;
    margin: 0;
    padding: 0.125rem 0.5rem;

    border-radius: 1.125rem;
  }
</style>
