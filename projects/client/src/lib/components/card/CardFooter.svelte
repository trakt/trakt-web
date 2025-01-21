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
      width: 100%;
      margin-top: var(--ni-neg-4);
      overflow: hidden;

      display: flex;
      flex-direction: column;
      gap: var(--ni-4);

      &:global(:has(> :nth-child(2))) {
        justify-content: center;
      }

      &:global(> :nth-child(2)) {
        max-width: 80%;
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
