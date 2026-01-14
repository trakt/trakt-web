<script lang="ts">
  import type { Snippet } from "svelte";

  type SummaryContainerProps = {
    poster?: Snippet;
    contextualContent?: Snippet;
    topActions?: Snippet;
  } & ChildrenProps;

  const {
    poster,
    contextualContent: content,
    children,
    topActions: actions,
  }: SummaryContainerProps = $props();
</script>

<div class="trakt-summary-container" class:has-contextual-content={content}>
  {#if poster}
    <div class="trakt-summary-poster">
      {@render poster()}
    </div>
  {/if}
  <div class="trakt-summary-content" class:has-actions={actions}>
    {#if actions}
      <div class="trakt-summary-actions">
        {@render actions()}
      </div>
    {/if}
    <div class="trakt-summary-children">
      {@render children()}
    </div>
  </div>
  {#if content}
    <div class="trakt-summary-contextual-content">
      {@render content()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-container {
    display: grid;
    gap: var(--gap-xl);
    grid-template-columns: minmax(0, var(--summary-poster-width)) 1fr;

    min-height: var(--ni-380);
    max-width: var(--ni-1280);

    margin: 0 var(--layout-distance-side);
    padding-top: var(--ni-38);

    @include for-desktop {
      &.has-contextual-content {
        grid-template-columns:
          minmax(0, var(--summary-poster-width))
          1fr
          var(--ni-320);
      }
    }
  }

  .trakt-summary-content {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;

    &.has-actions {
      justify-content: space-between;
    }
  }

  .trakt-summary-children {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    justify-content: space-between;
  }

  .trakt-summary-contextual-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .trakt-summary-actions {
    margin-left: var(--ni-neg-16);
  }

  .trakt-summary-poster {
    display: flex;
    align-items: center;

    :global(img),
    :global(.trakt-summary-poster-overlay) {
      width: 100%;
    }
  }
</style>
