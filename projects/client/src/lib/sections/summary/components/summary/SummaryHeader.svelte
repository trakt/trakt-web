<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";

  const {
    children,
    headerActions,
  }: ChildrenProps & { headerActions?: Snippet } = $props();
</script>

<div class="trakt-summary-header">
  {#if headerActions}
    <RenderFor audience="all" navigation="default">
      <div class="trakt-summary-action-header">
        {@render headerActions()}
      </div>
    </RenderFor>
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
    gap: var(--gap-xs);
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
