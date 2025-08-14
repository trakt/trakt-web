<script lang="ts">
  const { title, children }: ChildrenProps & { title: string } = $props();
</script>

<div class="trakt-toggle-row">
  <span class="trakt-toggle-row-title secondary">{title}</span>
  <div class="trakt-toggle-row-content">{@render children()}</div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-toggle-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .trakt-toggle-row-content {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    gap: var(--gap-xs);

    min-width: 0;
    flex: 1;
  }
</style>
