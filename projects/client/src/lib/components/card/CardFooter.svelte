<script lang="ts">
  import type { CardFooterProps } from "./CardFooterProps";

  const { children, action }: CardFooterProps = $props();
</script>

<div class="card-footer">
  {#if children}
    <div class="card-footer-information">
      {@render children()}
    </div>
  {/if}

  {#if action}
    <div class="card-footer-action">
      {@render action()}
    </div>
  {/if}
</div>

<style>
  .card-footer {
    position: relative;

    height: calc(var(--height-card) - var(--height-card-cover));
    padding: var(--ni-8);
    box-sizing: border-box;

    display: flex;
    gap: var(--ni-8);
    justify-content: space-between;

    .card-footer-information {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      overflow: hidden;

      &:global(:has(> :nth-child(2))) {
        justify-content: center;
      }

      &:global(:has(> :nth-child(1)):not(:has(> :nth-child(2)))) {
        margin-top: var(--ni-8);
      }
    }

    .card-footer-action {
      position: absolute;
      bottom: var(--ni-neg-16);
      right: var(--ni-8);
      display: flex;
      gap: var(--ni-4);
    }
  }
</style>
