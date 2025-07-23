<script lang="ts">
  const { title, children }: ChildrenProps & { title: string } = $props();
</script>

<div class="trakt-settings-row">
  <span class="trakt-settings-row-title ellipsis">{title}</span>
  <div class="trakt-settings-row-content">{@render children()}</div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .trakt-settings-row-title {
      max-width: var(--ni-200);
      flex: 1;
    }
  }

  .trakt-settings-row-content {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
    flex: 1;
  }
</style>
