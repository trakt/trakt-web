<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    children,
    action,
  }: Partial<ChildrenProps> & { title: string; action?: Snippet } = $props();
</script>

<div class="trakt-settings-row" class:has-children={Boolean(children)}>
  <span class="trakt-settings-row-title secondary capitalize">{title}</span>
  <div class="trakt-settings-row-content">
    {@render children?.()}
    {@render action?.()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .trakt-settings-row-content {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--gap-xs);

      min-width: 0;
      flex: 1;
    }

    .trakt-settings-row-title {
      text-transform: capitalize;
    }

    &.has-children {
      .trakt-settings-row-title {
        --title-width: var(--ni-104);

        width: var(--title-width);
      }

      .trakt-settings-row-content {
        justify-content: space-between;
      }
    }
  }
</style>
