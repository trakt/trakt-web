<script lang="ts">
  import type { Snippet } from "svelte";

  type SummaryContainerProps = {
    poster?: Snippet;
    contextualContent?: Snippet;
  } & ChildrenProps;

  const {
    poster,
    contextualContent: content,
    children,
  }: SummaryContainerProps = $props();
</script>

<div class="trakt-summary-container">
  {#if poster}
    <div class="trakt-summary-poster">
      {@render poster()}
    </div>
  {/if}
  <div class="trakt-summary-children">
    {@render children()}
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

      .trakt-summary-children {
        grid-column: 1;
      }

      :global(.trakt-summary-poster) {
        height: var(--ni-120);
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .trakt-summary-children {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    align-self: end;
    gap: var(--ni-32);
  }

  .trakt-summary-contextual-content {
    display: flex;
    justify-content: center;
    align-items: end;
  }
</style>
