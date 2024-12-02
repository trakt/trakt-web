<script lang="ts">
  import type { Snippet } from "svelte";

  type MediaSummaryContainerProps = {
    poster: Snippet;
    contextualContent?: Snippet;
  } & ChildrenProps;

  const {
    poster,
    contextualContent: content,
    children,
  }: MediaSummaryContainerProps = $props();
</script>

<div class="trakt-summary-container">
  <div class="trakt-summary-poster">
    {@render poster()}
  </div>
  <div class="trakt-summary-children">
    {@render children()}
  </div>
  {#if content}
    <div class="trakt-summary-contextual-content">
      {@render content()}
    </div>
  {/if}
</div>

<style>
  .trakt-summary-container {
    display: grid;
    gap: var(--ni-32);
    grid-template-columns: 1fr 2fr 1fr;
    margin: 0 var(--ni-56);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;

      :global(.trakt-summary-poster) {
        height: var(--ni-120);
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .trakt-summary-children {
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
