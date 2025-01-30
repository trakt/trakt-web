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
    <div class="trakt-summary-contextual-actions">
      {@render contextualActions()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-actions {
    display: flex;
    gap: var(--gap-m);
    justify-content: flex-end;
    flex-wrap: wrap;

    @include for-tablet-sm {
      display: grid;
      grid-template-columns: 1fr 1fr;

      gap: var(--gap-xs);
    }

    @include for-mobile {
      gap: var(--gap-xs);
    }
  }

  .trakt-summary-contextual-actions {
    justify-self: end;

    @include for-tablet-sm {
      grid-column: span 2;
    }
  }
</style>
