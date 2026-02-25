<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-vip-feature-icon">{@render children()}</div>

<style>
  .trakt-vip-feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-36);
    height: var(--ni-36);

    background: color-mix(in srgb, var(--color-text-primary) 15%, transparent);

    border-radius: 50%;
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-text-primary) 20%, transparent);

    box-shadow: var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 15%, transparent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }
</style>
