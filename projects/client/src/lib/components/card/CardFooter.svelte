<script lang="ts">
  import type { CardFooterProps } from "./CardFooterProps";

  const { children, action, tag }: CardFooterProps = $props();
</script>

<div class="trakt-card-footer">
  {#if tag}
    <div class="trakt-card-footer-tag">{@render tag()}</div>
  {/if}

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
  :global(.trakt-card-transparent) {
    .trakt-card-footer {
      padding: var(--ni-8) 0;
    }
  }

  .trakt-card-footer {
    position: relative;

    height: calc(var(--height-card) - var(--height-card-cover));
    padding: var(--ni-8);
    box-sizing: border-box;

    display: flex;
    gap: var(--gap-xs);
    justify-content: space-between;
    align-items: center;

    :global(.trakt-link) {
      text-decoration: none;
    }

    .trakt-card-footer-information {
      width: 100%;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      :global(.trakt-card-tag) {
        display: flex;
      }

      :global(.trakt-card-title) {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 500;
        font-size: var(--ni-11);

        :global(:has(~ .trakt-card-subtitle)) {
          font-weight: 600;
        }
      }

      :global(.trakt-card-subtitle) {
        color: var(--color-text-secondary);
        margin: 0;
        font-weight: 500;
        font-size: var(--ni-11);
      }
    }
  }
</style>
