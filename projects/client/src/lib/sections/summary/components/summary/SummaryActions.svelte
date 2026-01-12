<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    contextualActions,
  }: {
    contextualActions?: Snippet;
  } & ChildrenProps = $props();
</script>

<div class="trakt-summary-actions">
  {@render children()}

  {#if contextualActions}
    {@render contextualActions()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-actions {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--gap-xs);
  }
</style>
