<script lang="ts">
  const {
    children,
    variant = "default",
  }: { variant?: "default" | "plain" } & ChildrenProps = $props();
</script>

<div class="trakt-vip-glass-card" data-variant={variant}>
  {@render children()}
</div>

<style>
  .trakt-vip-glass-card {
    overflow: hidden;

    padding: var(--ni-24);

    backdrop-filter: blur(var(--ni-24));
    background: radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--red-900) 20%, transparent) 0%,
      transparent 60%
    );

    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 15%, transparent);
    border-radius: var(--border-radius-xl);

    box-shadow: var(--ni-0) var(--ni-8) var(--ni-16) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent);

    &[data-variant="plain"] {
      border: none;
      backdrop-filter: blur(var(--ni-10));
      background: color-mix(in srgb, var(--shade-10) 10%, transparent);
      padding: var(--ni-16);
    }
  }
</style>
