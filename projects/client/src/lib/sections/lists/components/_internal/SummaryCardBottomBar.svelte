<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import type { SummaryCardLayout } from "../models/SummaryCardLayout";

  const {
    children,
    tag,
    layout = "default",
  }: ChildrenProps & {
    tag?: Snippet;
    layout?: SummaryCardLayout;
  } = $props();
</script>

<div class="trakt-summary-card-bottom-bar" data-layout={layout}>
  {#if tag}
    <div class="trakt-summary-bottom-bar-tags" in:fade={{ duration: 150 }}>
      {@render tag()}
    </div>
  {/if}

  {@render children()}
</div>

<style>
  .trakt-summary-card-bottom-bar {
    --poster-width: calc(
      var(--height-summary-card-cover) * var(--poster-aspect-ratio, 0)
    );

    position: absolute;
    bottom: 0;
    inset-inline-end: 0;
    width: calc(100% - var(--poster-width));

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-xs);

    padding: var(--ni-12);
    box-sizing: border-box;

    z-index: var(--layer-floating);

    &[data-layout="minimal"],
    &[data-layout="compact"] {
      --poster-width: calc(
        var(--height-summary-card-cover-compact) * var(--poster-aspect-ratio, 0) +
          var(--height-summary-card-compact) -
          var(--height-summary-card-cover-compact)
      );
    }
  }

  .trakt-summary-bottom-bar-tags {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    flex-grow: 1;
  }

  .trakt-summary-card-bottom-bar[data-layout="large"]
    .trakt-summary-bottom-bar-tags {
    min-width: 0;
  }
</style>
