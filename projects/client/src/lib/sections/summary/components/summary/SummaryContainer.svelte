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
    gap: var(--ni-32);
    grid-template-columns: minmax(var(--ni-320), 1fr) 2fr 1fr;
    margin: 0 var(--ni-56);

    @include for-tablet-sm-and-below {
      margin: 0 var(--layout-distance-side);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;

      .trakt-summary-content {
        grid-column: 1;
      }

      :global(.trakt-summary-poster) {
        height: var(--ni-120);
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .trakt-summary-content {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: end;

    &.has-actions {
      justify-content: space-between;
    }
  }

  .trakt-summary-children {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
  }

  .trakt-summary-contextual-content {
    display: flex;
    justify-content: center;
    align-items: end;
  }

  .trakt-summary-actions {
    margin-left: var(--ni-neg-16);
  }
</style>
