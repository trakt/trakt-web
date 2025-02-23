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
  <div class="trakt-summary-main-actions">
    {@render children()}
  </div>
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
    flex-direction: column;

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
    }
  }

  .trakt-summary-main-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    @include for-tablet-sm {
      :global(.trakt-button) {
        flex-basis: calc(50% - var(--gap-xs) / 2);
      }
    }
  }

  .trakt-summary-contextual-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
