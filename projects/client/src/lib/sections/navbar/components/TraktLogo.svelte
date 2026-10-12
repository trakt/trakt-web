<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import SeasonalLogoHat from "$lib/features/theme/components/SeasonalLogoHat.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-logo">
  <Link href={UrlBuilder.home()}>
    <CircularLogo />
  </Link>
  <SeasonalLogoHat />
</div>

<style>
  .trakt-logo {
    position: relative;
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
