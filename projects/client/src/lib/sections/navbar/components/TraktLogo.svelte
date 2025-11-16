<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<RenderFor
  audience="authenticated"
  device={["desktop", "tablet-lg", "tablet-sm"]}
>
  <div class="trakt-logo">
    <Link href={UrlBuilder.home()}>
      <RenderFor audience="authenticated" device={["tablet-sm"]}>
        <LogoMark />
      </RenderFor>
      <RenderFor audience="authenticated" device={["desktop", "tablet-lg"]}>
        <Logo />
      </RenderFor>
    </Link>
  </div>
</RenderFor>

<RenderFor audience="public">
  <div class="trakt-logo">
    <Logo />
  </div>
</RenderFor>

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
