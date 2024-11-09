<script>
  import LogoMarkCircle from "../logo/LogoMarkCircle.svelte";
</script>

<div class="trakt-vip-badge">
  <LogoMarkCircle --color-foreground="var(--color-foreground-vip-badge)" />
  <span>VIP</span>
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

    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;

    :global(svg) {
      width: 1rem;
      height: 1rem;
    }
  }
</style>
