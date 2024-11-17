<script lang="ts">
  import type { CardFooterProps } from "./CardFooterProps";

  const { children, actions }: CardFooterProps = $props();
</script>

<div class="card-footer">
  <div class="card-footer-information">
    {@render children()}
  </div>
  {#if actions}
    <div class="card-footer-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .card-footer {
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;

    .card-footer-information {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: hidden;
    }
  }
</style>
