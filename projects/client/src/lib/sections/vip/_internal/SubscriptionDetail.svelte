<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    icon,
    title,
  }: { icon: Snippet; title: string } & ChildrenProps = $props();
</script>

<div class="trakt-vip-subscription-detail">
  <div class="subscription-detail-icon">
    {@render icon()}
  </div>

  <div class="subscription-detail-header">
    <span class="secondary">{title}</span>
    <span class="bold">{@render children()}</span>
  </div>
</div>

<style>
  .trakt-vip-subscription-detail {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .subscription-detail-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    width: var(--ni-36);
    height: var(--ni-36);

    background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-text-primary) 10%, transparent);

    :global(svg) {
      color: var(--color-text-secondary);

      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .subscription-detail-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
