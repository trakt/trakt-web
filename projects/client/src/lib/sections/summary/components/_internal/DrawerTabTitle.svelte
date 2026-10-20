<script lang="ts">
  import ListLabel from "$lib/components/lists/ListLabel.svelte";
  import type { Snippet } from "svelte";

  const {
    title,
    count,
    actions,
  }: {
    title: string;
    count?: number;
    actions?: Snippet;
  } = $props();
</script>

<div class="drawer-tab-title">
  <ListLabel {title} {count} />

  {#if actions}
    <div class="drawer-tab-title-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style lang="scss">
  .drawer-tab-title {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-height: var(--ni-40);
  }

  .drawer-tab-title-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
