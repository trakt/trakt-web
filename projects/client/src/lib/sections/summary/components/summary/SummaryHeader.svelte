<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    headerActions,
  }: ChildrenProps & { headerActions?: Snippet } = $props();
</script>

<div class="trakt-summary-header">
  {#if headerActions}
    <div class="trakt-summary-action-header">
      {@render headerActions()}
    </div>
  {/if}
  <div class="trakt-summary-header-children">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-action-header {
    width: 100%;

    display: flex;
    justify-content: flex-end;

    &:global(:has(> :nth-child(n + 2))) {
      justify-content: space-between;
    }
  }

  .trakt-summary-header-children {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
