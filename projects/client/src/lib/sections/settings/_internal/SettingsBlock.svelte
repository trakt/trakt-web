<script lang="ts">
  const { title, children }: ChildrenProps & { title: string } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header">
    <p class="meta-info">{title}</p>
  </div>
  <div class="trakt-settings-block-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-settings-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-settings-block-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
