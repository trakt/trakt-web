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
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-l);

    @include for-tablet-lg {
      flex-direction: column;
      align-items: start;
      gap: var(--gap-s);
    }
  }
</style>
