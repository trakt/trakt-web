<script lang="ts">
  import type { CardFooterProps } from "./CardFooterProps";

  const { children, actions }: CardFooterProps = $props();
</script>

<div class="card-footer">
  {#if children}
    <div class="card-footer-information">
      {@render children()}
    </div>
  {/if}

  {#if actions}
    <div class="card-footer-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .card-footer {
    height: calc(var(--height-card) - var(--height-card-cover));
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .card-footer-information {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: hidden;
    }
  }
</style>
