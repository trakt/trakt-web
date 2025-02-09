<script lang="ts">
  import type { CardFooterProps } from "./CardFooterProps";

  const { children, action }: CardFooterProps = $props();
</script>

<div class="trakt-card-footer">
  {#if children}
    <div class="trakt-card-footer-information">
      {@render children()}
    </div>
  {/if}

  {#if action}
    <div class="trakt-card-footer-action">
      {@render action()}
    </div>
  {/if}
</div>

<style>
  .trakt-card-footer {
    position: relative;

    height: calc(var(--height-card) - var(--height-card-cover));
    padding: var(--ni-8);
    box-sizing: border-box;

    display: flex;
    gap: var(--gap-xs);
    justify-content: space-between;

    :global(.trakt-link) {
      text-decoration: none;
    }

    .trakt-card-footer-information {
      width: 100%;
      margin-top: var(--ni-neg-4);
      overflow: hidden;

      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      &:global(:has(> :nth-child(2))) {
        justify-content: center;
      }

      &:global(> :nth-child(2)) {
        max-width: 80%;
      }
    }

    .trakt-card-footer-action {
      position: absolute;
      bottom: var(--ni-neg-16);
      right: var(--ni-8);
      display: flex;
      gap: var(--gap-xxs);
    }
  }
</style>
