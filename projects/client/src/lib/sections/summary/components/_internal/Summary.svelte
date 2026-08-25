<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import type { Snippet } from "svelte";
  import SummarySideActions from "./SummarySideActions.svelte";

  const {
    children,
    poster,
    meta,
    sideActions,
    color,
    variant = "page",
  }: {
    poster: Snippet;
    meta: Snippet;
    sideActions?: Snippet;
    color?: string;
    variant?: "page" | "drawer";
  } & ChildrenProps = $props();

  const mainColor = $derived(color ?? "rgba(0, 0, 0, 0.56)");
</script>

<div class="trakt-summary" data-variant={variant}>
  <div class="trakt-summary-main" style={`--main-color: ${mainColor}`}>
    <SummarySideActions>
      {#if variant === "page"}
        <BackButton />
      {/if}
    </SummarySideActions>

    {@render poster()}

    <SummarySideActions>
      {@render sideActions?.()}
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

    padding: var(--gap-m) var(--layout-distance-side);

    &[data-variant="drawer"] {
      --summary-poster-width: var(--ni-220);
      --summary-side-action-bar-width: var(--ni-0);

      --glance-line-height: var(--ni-16);
      --glance-title-lines: 1;
      --glance-ratings-height: var(--ni-24);
      --glance-actions-height: var(--ni-56);
      --glance-overview-lines: 3;
      --glance-overview-height: calc(
        var(--glance-overview-lines) * var(--font-size-text) * 1.5
      );

      padding-inline: 0;
      padding-block-start: 0;
    }
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
