<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { navigateToTraktOg } from "$lib/utils/url/navigateToTraktOg";
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

  const { track } = useTrack(AnalyticsEvent.LeaveLite);
</script>

{#snippet traktSwitch()}
  <Switch
    label={m.switch_to_og()}
    checked={true}
    innerText="Lite"
    onclick={() => {
      track();
      navigateToTraktOg();
    }}
  />
{/snippet}

<header>
  <nav class="trakt-navbar" class:trakt-navbar-scroll={isScrolled}>
    <RenderFor
      audience="authenticated"
      device={["tablet-sm", "tablet-lg", "desktop"]}
    >
      <div class="trakt-logo">
        <Link href={UrlBuilder.home()}>
          <LogoMark />
        </Link>
      </div>
    </RenderFor>
    <RenderFor audience="public">
      <div class="trakt-logo">
        <Logo />
      </div>
    </RenderFor>

    <div class="trakt-navbar-content">
      <RenderFor
        audience="authenticated"
        device={["tablet-sm", "tablet-lg", "desktop"]}
      >
        {@render traktSwitch()}
      </RenderFor>
      <RenderFor audience="authenticated">
        <SearchInput />
      </RenderFor>
      <RenderFor audience="authenticated" device={["mobile"]}>
        {@render traktSwitch()}
      </RenderFor>
    </div>

    <div class="trakt-navbar-links">
      <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
        <Button
          href={UrlBuilder.home()}
          label={m.navbar_link_home_label()}
          style="underlined"
          variant="primary"
          color="purple"
          data-testid={TestId.NavBarHomeButton}
        >
          {m.navbar_link_home()}
        </Button>
        <Button
          href={UrlBuilder.shows()}
          label={m.navbar_link_shows_label()}
          style="underlined"
          variant="primary"
          color="purple"
          data-testid={TestId.NavBarShowsButton}
        >
          {m.navbar_link_shows()}
        </Button>
        <Button
          href={UrlBuilder.movies()}
          label={m.navbar_link_movies_label()}
          style="underlined"
          variant="primary"
          color="purple"
          data-testid={TestId.NavBarMoviesButton}
        >
          {m.navbar_link_movies()}
        </Button>
      </RenderFor>
      <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
        <Button
          href={UrlBuilder.watchlist()}
          label={m.navbar_link_watchlist_label()}
          style="underlined"
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

  @mixin navbar-spacing($side-margin) {
    margin: var(--ni-12) $side-margin;
    margin-top: calc(var(--ni-12) + env(safe-area-inset-top));
    padding: var(--ni-12) var(--navbar-side-padding);
  }

  .trakt-navbar-spacer {
    box-sizing: border-box;
    height: var(--navbar-height);

    @include navbar-spacing(auto);
  }

  .trakt-navbar {
    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    box-sizing: border-box;
    display: flex;
    width: 100dvw;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);
    padding: var(--ni-12) var(--layout-distance-side);

    align-items: center;
    gap: var(--gap-l);

    border-radius: var(--border-radius-m);
    transition: var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: padding, margin, width, background-color, box-shadow;

    @include for-mobile {
      gap: var(--gap-m);
    }

    .trakt-navbar-content {
      width: 100%;

      display: flex;
      align-items: center;
      gap: var(--gap-m);
    }

    .trakt-navbar-links {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
      justify-content: end;
    }
  }

  .trakt-navbar-scroll {
    background-color: var(--color-background-navbar);
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    backdrop-filter: blur(8px);

    color: var(--color-foreground-navbar);

    /** 
      * Navbar links have custom design,
      * to accommodate the scrolled navbar
      * we need to override the button styles
      */
    :global(.trakt-button[data-style="underlined"]) {
      color: var(--color-foreground-navbar);
    }

    @include for-mouse {
      :global(.trakt-button[data-style="underlined"]) {
        &:hover:not([disabled]) {
          text-decoration-color: var(--color-foreground-navbar);
        }
      }
    }

    &.trakt-navbar {
      width: calc(100dvw - 2 * var(--layout-distance-side));

      @include navbar-spacing(var(--layout-distance-side));
    }
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
