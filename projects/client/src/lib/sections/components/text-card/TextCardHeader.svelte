<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    subTitle,
    icon,
    actions,
    children,
  }: { subTitle: string; icon: Snippet; actions?: Snippet } & ChildrenProps =
    $props();
</script>

<div class="trakt-text-card-header">
  <div class="trakt-text-card-header-content">
    <div class="trakt-text-card-header-icon">
      {@render icon()}
    </div>

    <div class="trakt-text-card-header-title">
      <div class="trakt-text-card-title">
        {@render children()}
      </div>
      <p class="secondary">
        {subTitle}
      </p>
    </div>
  </div>

  {#if actions}
    <div>
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .trakt-text-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-s);
  }

  .trakt-text-card-header-content {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-32);

    min-width: 0;
  }

  .trakt-text-card-header-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .trakt-text-card-header-title {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .trakt-text-card-title {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    overflow: hidden;

    height: var(--ni-18);

    :global(.trakt-link) {
      min-width: 0;
    }
  }
</style>
