<script lang="ts">
  const {
    children,
    variant = "default",
  }: { variant?: "default" | "plain" | "bordered" } & ChildrenProps = $props();
</script>

<div class="trakt-vip-glass-card" data-variant={variant}>
  {@render children()}
</div>

<style>
  .trakt-vip-glass-card {
    overflow: hidden;

    padding: var(--ni-24);

    backdrop-filter: var(--filter-surface-blur, blur(var(--ni-24)));
    background: var(--background-vip-glass-card);

    border: var(--ni-1) solid
      var(
        --color-flat-border-if-reduced,
        color-mix(in srgb, var(--shade-10) 15%, transparent)
      );
    border-radius: var(--border-radius-xl);

    box-shadow: var(
      --shadow-decorative-bordered-surface,
      var(--shadow-base)
    );

    &[data-variant="plain"] {
      border: none;
      box-shadow: var(--shadow-base);
      backdrop-filter: var(--filter-surface-blur, blur(var(--ni-10)));
      background: var(--background-vip-plain-glass-card);
      padding: var(--ni-16);
    }

    &[data-variant="bordered"] {
      border: var(--ni-1) solid var(--color-vip-border-accent);
      padding: var(--ni-32);
    }
  }
</style>
