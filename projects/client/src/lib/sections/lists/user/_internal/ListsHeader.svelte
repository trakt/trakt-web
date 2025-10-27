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
    {@render icon?.()}
    <h4 class="secondary">{title}</h4>
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
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-m);
    height: var(--ni-32);
    user-select: none;

    margin: 0 var(--layout-distance-side);
    transition: margin calc(var(--transition-increment) * 2) ease-in-out;

    h4 {
      font-size: var(--ni-20);
      letter-spacing: -0.04rem;
    }

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
    gap: var(--gap-s);

    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }
</style>
