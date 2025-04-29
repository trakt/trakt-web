<script lang="ts">
  const { title, children }: { title: string } & ChildrenProps = $props();
</script>

<div class="trakt-filter">
  <span class="meta-info">{title}</span>
  {@render children()}
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
