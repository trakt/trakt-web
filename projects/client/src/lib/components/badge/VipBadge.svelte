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
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
    align-items: center;
    gap: 0.25rem;

    border-radius: 1.25rem;
    background: var(--color-background-vip-badge);
    color: var(--color-foreground-vip-badge);

    .small {
      font-weight: 700;
    }

    :global(svg) {
      width: 1rem;
      height: 1rem;
    }
  }
</style>
