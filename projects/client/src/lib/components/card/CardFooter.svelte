<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
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
    <RenderFor audience="all">
      <div class="trakt-card-footer-action">
        {@render action()}
      </div>
    </RenderFor>
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

    --card-height: var(--height-override-card, var(--height-card));
    --cover-height: var(--height-override-card-cover, var(--height-card-cover));

    height: calc(var(--card-height) - var(--cover-height));
    padding: var(--ni-8);
    box-sizing: border-box;

    display: flex;
    gap: var(--gap-xs);
    justify-content: space-between;
    align-items: center;

    :global(.trakt-link) {
      text-decoration: none;
    }

    .trakt-card-footer-tag {
      width: 100%;
      overflow: hidden;

      display: flex;
      gap: var(--gap-micro);
    }

    .trakt-card-footer-information {
      width: 100%;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);

      :global(.trakt-card-tag) {
        display: flex;
      }

      :global(.trakt-card-title) {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 500;
        font-size: var(--font-size-text);

        :global(:has(~ .trakt-card-subtitle)) {
          font-weight: 600;
        }
      }

      :global(.trakt-card-subtitle) {
        color: var(--color-text-secondary);
        margin: 0;
        font-weight: 500;
        font-size: var(--font-size-text);
      }
    }

    .trakt-card-footer-action {
      :global(.trakt-action-button[data-style="ghost"]),
      :global(.trakt-button[data-style="ghost"]) {
        backdrop-filter: none;
      }
    }
  }
</style>
