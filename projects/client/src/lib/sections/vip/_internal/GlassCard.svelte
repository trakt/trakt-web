<script lang="ts">
  const {
    children,
    variant = "default",
  }: { variant?: "default" | "plain" | "bordered" | "soft" } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-glass-card" data-variant={variant}>
  {@render children()}
</div>

<style>
  .trakt-vip-glass-card {
    position: relative;
    overflow: hidden;

    padding: var(--ni-24);

    backdrop-filter: blur(var(--ni-24));
    background: var(--background-vip-glass-card);

    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 15%, transparent);
    border-radius: var(--border-radius-xl);

    box-shadow: var(--shadow-base);

    &[data-variant="plain"] {
      border: none;
      backdrop-filter: blur(var(--ni-10));
      background: var(--background-vip-plain-glass-card);
      padding: var(--ni-16);
    }

    &[data-variant="soft"] {
      border: none;
      backdrop-filter: none;
      background: var(--color-vip-plan-surface);
      box-shadow: var(--shadow-vip-plan);
      padding: var(--ni-32);
    }

    &[data-variant="bordered"] {
      border: var(--ni-1) solid var(--color-vip-border-accent);
      padding: var(--ni-32);
    }
  }
</style>
