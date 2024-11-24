<script>
  import LogoMarkCircle from "../logo/LogoMarkCircle.svelte";
</script>

<div class="trakt-vip-badge">
  <LogoMarkCircle --color-foreground="var(--color-foreground-vip-badge)" />
  <p class="small">VIP</p>
</div>

<style>
  .trakt-vip-badge {
    display: flex;
    padding: var(--ni-4) var(--ni-8) var(--ni-4) var(--ni-4);
    align-items: center;
    gap: var(--ni-4);

    border-radius: var(--ni-20);
    background: var(--color-background-vip-badge);
    color: var(--color-foreground-vip-badge);

    .small {
      font-weight: 700;
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
