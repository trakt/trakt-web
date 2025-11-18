<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-logo">
  <Link href={UrlBuilder.home()}>
    <LogoMark />
  </Link>
</div>

<style>
  .trakt-logo {
    height: var(--ni-32);
    display: flex;
    justify-content: center;

    :global(svg) {
      /* Safari 🥲 */
      height: var(--ni-32);
    }

    :global(.trakt-link.trakt-link-active),
    :global(.trakt-link.trakt-link-active:visited) {
      color: var(--color-foreground);
    }
  }
</style>
