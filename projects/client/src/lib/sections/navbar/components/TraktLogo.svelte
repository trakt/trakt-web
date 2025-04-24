<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<RenderFor
  audience="authenticated"
  device={["tablet-sm", "tablet-lg", "desktop"]}
  navigation="default"
>
  <div class="trakt-logo">
    <Link href={UrlBuilder.home()}>
      <LogoMark />
    </Link>
  </div>
</RenderFor>

<RenderFor
  audience="authenticated"
  device={["tablet-sm", "tablet-lg", "desktop"]}
  navigation="dpad"
>
  <button
    class="trakt-logo-button"
    data-dpad-navigation={DpadNavigationType.Item}
    onclick={() => window.location.reload()}
  >
    <LogoMark />
  </button>
</RenderFor>

<RenderFor audience="public">
  <div class="trakt-logo">
    <Logo />
  </div>
</RenderFor>

<style>
  .trakt-logo-button {
    all: unset;
    border-radius: var(--border-radius-xs);

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-500);
      outline-offset: var(--gap-xs);
    }
  }

  .trakt-logo,
  .trakt-logo-button {
    height: var(--ni-32);
    display: flex;
    justify-content: center;

    :global(svg) {
      /* Safari 🥲 */
      height: var(--ni-32);
    }
  }
</style>
