<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    icon,
    description,
    title,
  }: { icon: Snippet; description: string; title: string } = $props();
</script>

<div class="trakt-vip-feature">
  <div class="trakt-vip-feature-icon">{@render icon()}</div>
  <h2 class="trakt-vip-feature-title">{title}</h2>
  <p class="trakt-vip-feature-description secondary">{description}</p>
</div>

<style>
  .trakt-vip-feature {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: var(--gap-s);

    background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid var(--color-border);

    padding: var(--ni-16);
  }

  .trakt-vip-feature-icon {
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .trakt-vip-feature-description {
    grid-column: 2;
  }
</style>
