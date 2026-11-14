<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
</script>

<div class="trakt-footer-logo">
  <Logo />
</div>

<style>
  .trakt-footer-logo {
    height: var(--ni-38);
    width: var(--ni-136);
    display: flex;

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
