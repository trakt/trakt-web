<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    icon,
    actions,
  }: { title: string; icon?: Snippet; actions?: Snippet } = $props();
</script>

<div class="trakt-lists-header">
  <div class="trakt-lists-title">
    {#if icon}
      <div class="trakt-lists-title-icon">
        {@render icon?.()}
      </div>
    {/if}

    <span class="title secondary">{title}</span>
  </div>

  {#if actions}
    <div class="trakt-lists-header-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-lists-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    height: var(--ni-32);
    user-select: none;

    margin: 0 var(--layout-distance-side);
    transition: margin calc(var(--transition-increment) * 2) ease-in-out;

    :global(.trakt-action-button) {
      --button-size: var(--ni-32);
    }

    @include for-mobile {
      :global(trakt-list-upsell-link) {
        width: 100%;
      }
    }
  }

  .trakt-lists-title {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    color: var(--color-text-secondary);
  }

  .trakt-lists-title-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-32);
    height: var(--ni-32);

    /* To visually align the icon with the title */
    margin-bottom: var(--ni-2);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .trakt-lists-header-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
  }
</style>
