<script>
  import Logo from "$lib/components/logo/Logo.svelte";
</script>

<div class="trakt-logo">
  <Logo />
</div>

<style>
  .trakt-logo {
    height: var(--ni-48);
    display: flex;
    /* Safari 🥲 */
    width: 35%;
  }
</style>
