<script lang="ts">
  import type { Snippet } from "svelte";

  const { title, actions }: { title: string; actions?: Snippet } = $props();
</script>

<div class="trakt-lists-header">
  <h6>{title}</h6>

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

    background: var(--toggler-background-color);
    padding: var(--ni-4) var(--ni-12);
    border-radius: var(--border-radius-s);

    :global(.trakt-action-button) {
      --button-size: var(--ni-32);
    }

    @include for-mobile {
      :global(trakt-list-upsell-link) {
        width: 100%;
      }
    }
  }
</style>
