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

    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);
  }

  .trakt-summary-main {
    --side-action-bar-width: var(--ni-40);
    --summary-gap: var(--gap-s);
    --poster-side-distance: calc(
      var(--layout-distance-side) + var(--side-action-bar-width) +
        var(--summary-gap)
    );
    --poster-width: calc(100dvw - 2 * var(--poster-side-distance));

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--summary-gap);

    :global(.trakt-summary-poster-container) {
      grid-column-start: 2;
    }

    :global(.trakt-summary-poster-container),
    :global(.trakt-summary-poster img) {
      width: var(--poster-width);
      height: calc(var(--poster-width) * 1.5);
    }

    :global(.trakt-summary-poster img) {
      box-shadow:
        var(--ni-0) var(--ni-11) var(--ni-24) var(--ni-0)
          color-mix(in srgb, var(--main-color) 16%, transparent),
        var(--ni-0) var(--ni-44) var(--ni-44) var(--ni-0)
          color-mix(in srgb, var(--main-color) 14%, transparent),
        var(--ni-0) var(--ni-104) var(--ni-60) var(--ni-0)
          color-mix(in srgb, var(--main-color) 8%, transparent),
        var(--ni-0) var(--ni-180) var(--ni-72) var(--ni-0)
          color-mix(in srgb, var(--main-color) 2%, transparent),
        var(--ni-0) var(--ni-280) var(--ni-80) var(--ni-0) transparent;
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
