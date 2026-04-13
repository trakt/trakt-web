<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  const {
    href,
    label,
    title,
    icon,
    isCollapsed,
    ariaLabel,
    children,
  }: {
    href: string;
    label: string;
    title: string;
    icon: Snippet;
    isCollapsed: boolean;
    ariaLabel?: string;
    children?: Snippet;
  } = $props();
</script>

<div class="nav-group">
  <div class="nav-main-link" class:is-expanded={!isCollapsed}>
    <Tooltip
      content={title}
      disabled={!isCollapsed}
      variant="compact"
      side="right"
      delayDuration={0}
      sideOffset={16}
    >
      <Link {href} {label}>
        {@render icon()}
        {#if !isCollapsed}
          <span class="bold ellipsis nav-label">{title}</span>
        {/if}
      </Link>
    </Tooltip>
  </div>

  {#if children && !isCollapsed}
    <div class="nav-sub-items" transition:slide={{ duration: 150 }}>
      <nav class="nav-sub-items-inner" aria-label={ariaLabel ?? title}>
        {@render children()}
      </nav>
    </div>
  {/if}
</div>

<style>
  .nav-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    width: 100%;
  }

  .nav-main-link {
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-expanded {
      justify-content: flex-start;
    }

    :global(.trakt-tooltip-trigger) {
      min-width: 0;
    }

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      text-decoration: none;
      min-width: 0;
    }

    :global(svg) {
      width: var(--nav-icon-size);
      height: var(--nav-icon-size);
      flex-shrink: 0;
      display: block;
    }
  }

  .nav-label {
    white-space: nowrap;
  }

  .nav-sub-items-inner {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding-left: calc(var(--nav-icon-size) + var(--gap-s));

    :global(.trakt-link) {
      text-decoration: none;
      transition-property: color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
