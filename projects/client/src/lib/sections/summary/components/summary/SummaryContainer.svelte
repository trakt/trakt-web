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

  /*
    TODO:
    - proper responsiveness
    - what about next episode card on shows page?
  */
</script>

<div class="trakt-summary-container">
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
    grid-template-columns:
      minmax(0, var(--summary-poster-width))
      1fr
      var(--ni-320);
    margin: 0 var(--layout-distance-side);
    min-height: var(--ni-380);

    @include for-tablet-lg {
      grid-template-columns: var(--summary-poster-width) 1fr;
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
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-summary-contextual-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    /* TODO: these do not belong here */
    :global(.trakt-list-inset-title) {
      margin: 0;
    }

    :global(.trakt-list-title .trakt-action-button) {
      display: none;
    }

    :global(.trakt-list-item-container) {
      padding: 0;
    }

    :global(.trakt-sentiments-card .trakt-card) {
      min-width: 0;
      --width-card: var(--ni-320);
    }
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
