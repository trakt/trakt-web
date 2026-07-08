<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    metaInfo,
    actions,
  }: {
    title: string;
    metaInfo?: Snippet;
    actions?: Snippet;
  } = $props();
</script>

<div class="drawer-tab-title">
  <div class="drawer-tab-title-main">
    <span class="title ellipsis">{title}</span>
    {#if metaInfo}
      {@render metaInfo()}
    {/if}
  </div>

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

  .drawer-tab-title-main {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .title {
      min-width: 0;
    }
  }

  .drawer-tab-title-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
