<script lang="ts">
  import ListLabel from "$lib/components/lists/ListLabel.svelte";
  import type { Snippet } from "svelte";

  type ListsHeaderProps = {
    title: string;
    icon?: Snippet;
    actions?: Snippet;
  };

  const { title, icon, actions }: ListsHeaderProps = $props();
</script>

<div class="trakt-lists-header">
  <div class="trakt-lists-title">
    {#if icon}
      <div class="trakt-lists-title-icon">
        {@render icon?.()}
      </div>
    {/if}

    <ListLabel {title} />
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
    min-width: 0;

    color: var(--color-text-secondary);
  }

  .trakt-lists-title-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-lists-header-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
  }
</style>
