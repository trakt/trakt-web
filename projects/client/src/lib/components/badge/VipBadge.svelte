<script>
  import VipIcon from "../icons/VipIcon.svelte";
</script>

<div class="trakt-vip-badge">
  <VipIcon />
  <p class="small">VIP</p>
</div>

<style>
  .trakt-vip-badge {
    display: flex;
    padding: var(--ni-8) var(--ni-12) var(--ni-8) var(--ni-12);
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-xl);
    background: var(--color-background-vip-badge);
    color: var(--color-foreground-vip-badge);

    box-shadow:
      var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 16%, transparent 84%),
      var(--ni-0) var(--ni-neg-2) var(--ni-4) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 25%, transparent 75%) inset,
      var(--ni-0) var(--ni-2) var(--ni-4) var(--ni-0)
        color-mix(in srgb, white 44%, transparent 56%) inset;

    .small {
      font-weight: 700;
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
