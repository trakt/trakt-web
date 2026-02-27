<script lang="ts">
  import type { Snippet } from "svelte";
  import SummarySideActions from "./SummarySideActions.svelte";

  const {
    children,
    poster,
    meta,
    sideActions,
    color,
  }: {
    poster: Snippet;
    meta: Snippet;
    sideActions: Snippet;
    color?: string;
  } & ChildrenProps = $props();

  const mainColor = $derived(color ?? "rgba(0, 0, 0, 0.56)");
</script>

<div class="trakt-summary">
  <div class="trakt-summary-main" style={`--main-color: ${mainColor}`}>
    {@render poster()}

    <SummarySideActions>
      {@render sideActions()}
    </SummarySideActions>
  </div>

  <div class="trakt-summary-meta-info">
    {@render meta()}
  </div>

  {@render children()}
</div>

<style>
  .trakt-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-top: var(--gap-m);
    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);
  }

  .trakt-summary-main {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--summary-poster-gap);

    :global(.trakt-summary-poster-container) {
      grid-column-start: 2;
    }

    :global(.trakt-summary-poster img) {
      box-shadow: var(--shadow-raised);
    }
  }

  .trakt-summary-meta-info {
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    gap: var(--gap-s);

    :global(.vote-count) {
      display: none;
    }
  }
</style>
