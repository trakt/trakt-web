<script lang="ts">
  import ChevronRightIcon from "$lib/components/icons/ChevronRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { AppRowProps } from "./AppRowProps.ts";

  const { icon, title, href, children, action }: AppRowProps = $props();
</script>

{#snippet body()}
  <span class="row-icon">{@render icon()}</span>

  <div class="row-body">
    <div class="row-heading">
      <span class="name bold ellipsis">{title}</span>
    </div>

    {#if children}
      <div class="row-meta secondary">{@render children()}</div>
    {/if}
  </div>

  {#if href}
    <span class="row-chevron"><ChevronRightIcon /></span>
  {/if}
{/snippet}

<div class="trakt-app-row">
  {#if href}
    <Link {href} color="inherit">
      {@render body()}
    </Link>
  {:else}
    <div class="row-surface">
      {@render body()}
      {#if action}
        <span class="row-action">{@render action()}</span>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-app-row {
    .row-surface,
    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-m);

      padding: var(--ni-12) var(--ni-16);

      text-decoration: none;
      color: inherit;
    }

    :global(.trakt-link) {
      transition: background-color var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover {
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 6%,
            transparent
          );
        }
      }
    }
  }

  .row-icon {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-40);
    height: var(--ni-40);

    border-radius: var(--border-radius-m);

    background-color: color-mix(
      in srgb,
      var(--color-link-active) 14%,
      transparent
    );
    color: var(--color-link-active);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .row-body {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .row-heading {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;

    .name {
      min-width: 0;
    }
  }

  .row-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-4) var(--gap-m);
    min-width: 0;

    font-size: var(--font-size-tag);
  }

  .row-chevron {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .row-action {
    flex-shrink: 0;

    display: flex;
    align-items: center;
  }
</style>
