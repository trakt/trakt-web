<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  const {
    children,
    tag,
    contextualTag,
  }: ChildrenProps & { tag?: Snippet; contextualTag?: Snippet } = $props();
</script>

<div
  class="trakt-summary-card-bottom-bar"
  class:has-contextualTag={Boolean(contextualTag)}
>
  {#if contextualTag}
    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      {@render contextualTag()}
    </RenderFor>
  {/if}

  {#if tag}
    <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
      <div class="trakt-summary-bottom-bar-tags" in:fade={{ duration: 150 }}>
        {@render tag()}
      </div>
    </RenderFor>
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
    right: 0;
    width: calc(100% - var(--poster-width));

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-xs);

    padding: var(--ni-12);
    box-sizing: border-box;

    z-index: var(--layer-floating);

    &.has-contextualTag {
      justify-content: space-between;
    }
  }

  .trakt-summary-bottom-bar-tags {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    flex-grow: 1;
  }
</style>
