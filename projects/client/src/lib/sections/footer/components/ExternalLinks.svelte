<script>
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";

  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-external-links">
  <Link href={UrlBuilder.app.ios()} target="_blank">
    <AppleIcon />
  </Link>
  <Link href={UrlBuilder.app.android()} target="_blank">
    <AndroidIcon />
  </Link>
</div>

<style>
  .trakt-external-links {
    display: flex;
    gap: var(--ni-24);

    :global(svg) {
      height: var(--ni-24);
      width: auto;
    }
  }
</style>
