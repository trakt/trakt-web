<script lang="ts">
  const {
    title,
    description,
    children,
  }: ChildrenProps & { title: string; description: string } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header">
    <p class="meta-info">{title}</p>
    <p class="smaller secondary">{description}</p>
  </div>
  <div class="trakt-settings-block-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-settings-block-header {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);

    p.meta-info {
      font-size: var(--ni-14);
    }
  }

  .trakt-settings-block,
  .trakt-settings-block-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }
</style>
