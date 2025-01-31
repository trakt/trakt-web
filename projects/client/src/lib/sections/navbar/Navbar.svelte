<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import BetaBadge from "$lib/sections/navbar/BetaBadge.svelte";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import SearchInput from "./components/search/SearchInput.svelte";
  import ProfileButton from "./ProfileButton.svelte";

  let windowScrollY = $state(0);
  const isScrolled = $derived(windowScrollY > 0);

  function handleScroll() {
    windowScrollY = window.scrollY;
  }

  onMount(() => {
    handleScroll();
    return GlobalEventBus.getInstance().register("scroll", handleScroll);
  });
</script>

<header>
  <nav class="trakt-navbar" class:trakt-navbar-scroll={isScrolled}>
    <div class="trakt-logo">
      <Link href={UrlBuilder.home()}>
        <RenderFor audience="authenticated">
          <LogoMark />
          <BetaBadge />
        </RenderFor>
        <RenderFor audience="public">
          <Logo />
        </RenderFor>
      </Link>
    </div>
    <div class="trakt-navbar-content">
      <RenderFor audience="authenticated">
        <SearchInput />
      </RenderFor>
    </div>
    <div class="trakt-navbar-links">
      <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
        <Button
          href={UrlBuilder.home()}
          label={m.navbar_link_home_label()}
          style="ghost"
          variant="primary"
          color="purple"
        >
          {m.navbar_link_home()}
        </Button>
        <Button
          href={UrlBuilder.shows()}
          label={m.navbar_link_shows_label()}
          style="ghost"
          variant="primary"
          color="purple"
        >
          {m.navbar_link_shows()}
        </Button>
        <Button
          href={UrlBuilder.movies()}
          label={m.navbar_link_movies_label()}
          style="ghost"
          variant="primary"
          color="purple"
        >
          {m.navbar_link_movies()}
        </Button>
      </RenderFor>
      <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
        <Button
          href={UrlBuilder.watchlist()}
          label={m.navbar_link_watchlist_label()}
          style="ghost"
          variant="primary"
          color="purple"
        >
          {m.navbar_link_watchlist()}
        </Button>
      </RenderFor>
      <RenderFor audience="public">
        <JoinTraktButton />
      </RenderFor>
      <RenderFor audience="authenticated">
        <ProfileButton />
      </RenderFor>
    </div>
  </nav>

  <div class="trakt-navbar-spacer"></div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-navbar,
  .trakt-navbar-spacer {
    box-sizing: border-box;
    margin: var(--ni-12) auto;
    margin-top: calc(var(--ni-12) + env(safe-area-inset-top));
    padding: var(--ni-12) var(--ni-16);
    height: var(--ni-64);
  }

  .trakt-navbar {
    z-index: 999;
    position: fixed;
    top: 0;
    left: var(--layout-distance-side);

    display: flex;
    width: calc(100dvw - 2 * var(--layout-distance-side));

    align-items: center;
    gap: var(--gap-l);

    border-radius: var(--border-radius-l);
    transition: var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color, box-shadow;

    @include for-mobile {
      gap: var(--gap-m);
    }

    .trakt-navbar-content {
      width: 100%;
    }

    .trakt-navbar-links {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
      justify-content: end;

      /** 
      * Navbar links have custom design,
      * to accommodate the custom cover background
      * so we need to override the button styles
      */
      :global(.trakt-button.trakt-link-active[data-style="ghost"]) {
        background: color-mix(
          in srgb,
          var(--color-background-button) 70%,
          transparent 30%
        );
        color: var(--color-foreground-button);
      }
    }
  }

  .trakt-navbar-scroll {
    background-color: var(--color-background-navbar);
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    backdrop-filter: blur(8px);

    color: var(--color-foreground-navbar);
  }

  .trakt-logo {
    height: var(--ni-32);
    display: flex;
    justify-content: center;

    :global(svg) {
      /* Safari 🥲 */
      height: var(--ni-32);
    }
  }
</style>
