<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
</script>

<div class="trakt-footer-logo">
  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    <div class="trakt-logo">
      <Logo />
    </div>
  </RenderFor>

  <div class="trakt-taglines">
    <p class="trakt-tagline bold">discover.track.share.</p>
  </div>
</div>

<style>
  .trakt-footer-logo {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-logo {
    height: var(--ni-38);
    width: var(--ni-136);
    display: flex;

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .trakt-tagline {
    white-space: nowrap;
  }
</style>
