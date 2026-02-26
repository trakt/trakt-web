<script lang="ts">
  const { children, size }: { size?: "normal" | "large" } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-badge" data-size={size}>
  <p class="uppercase">
    {@render children()}
  </p>
</div>

<style>
  .trakt-vip-badge {
    display: flex;
    padding: var(--ni-8) var(--ni-12);
    align-items: center;
    gap: var(--gap-xs);

    height: var(--ni-28);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    background: var(--color-background-vip-badge);
    color: var(--color-foreground-vip-badge);

    p {
      font-weight: 700;
      white-space: nowrap;
    }

    &[data-size="large"] {
      padding: var(--ni-12) var(--ni-16);
      height: var(--ni-40);

      p {
        font-size: var(--font-size-title);
      }
    }
  }
</style>
