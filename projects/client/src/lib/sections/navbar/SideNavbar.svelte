<script lang="ts">
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BetaBadge from "./components/BetaBadge.svelte";
  import FilterButton from "./components/filter/FilterButton.svelte";
  import TraktLogo from "./components/TraktLogo.svelte";
  import ProfileButton from "./ProfileButton.svelte";

  const isTV = $derived(browser && getDeviceType(navigator.userAgent) === "tv");
</script>

<header>
  <nav
    class="trakt-side-navbar"
    data-dpad-navigation={DpadNavigationType.Navbar}
  >
    <div class="trakt-side-navbar-top">
      <TraktLogo />
      {#if isTV}
        <BetaBadge />
      {/if}
    </div>

    <div class="trakt-side-navbar-content">
      <Link href={UrlBuilder.home()} navigationType={DpadNavigationType.Item}>
        <div class="trakt-side-navbar-link">
          <HomeIcon />
          <h6>{m.button_text_home()}</h6>
        </div>
      </Link>

      <Link href={UrlBuilder.shows()} navigationType={DpadNavigationType.Item}>
        <div class="trakt-side-navbar-link">
          <ShowIcon />
          <h6>{m.button_text_browse_shows()}</h6>
        </div>
      </Link>

      <Link href={UrlBuilder.movies()} navigationType={DpadNavigationType.Item}>
        <div class="trakt-side-navbar-link">
          <MovieIcon />
          <h6>{m.button_text_browse_movies()}</h6>
        </div>
      </Link>

      <RenderFor audience="authenticated">
        <Link
          href={UrlBuilder.lists.user()}
          navigationType={DpadNavigationType.Item}
        >
          <div class="trakt-side-navbar-link">
            <WatchlistIcon />
            <h6>{m.lists()}</h6>
          </div>
        </Link>
      </RenderFor>
    </div>

    <div class="trakt-side-navbar-bottom">
      <RenderFor audience="authenticated">
        <LocalePicker />
        <FilterButton />
        <ProfileButton />
      </RenderFor>
    </div>
  </nav>
</header>

<style>
  header {
    --navbar-width: var(--ni-66);
    --navbar-item-width: var(--ni-32);
    --navbar-margin: var(--ni-12);
    --navbar-margin-top: calc(var(--navbar-margin) + env(safe-area-inset-top));
    --navbar-margin-bottom: calc(
      var(--navbar-margin) + env(safe-area-inset-bottom)
    );
    --navbar-padding: calc(
      (var(--navbar-width) - var(--navbar-item-width)) / 2
    );
  }

  .trakt-side-navbar {
    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    width: var(--navbar-width);
    min-width: var(--navbar-width);
    height: calc(
      100dvh - var(--navbar-margin-top) - var(--navbar-margin-bottom)
    );

    background-color: var(--color-background-navbar);
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    backdrop-filter: blur(8px);
    color: var(--color-foreground-navbar);

    margin: var(--navbar-margin);
    margin-top: var(--navbar-margin-top);
    margin-bottom: var(--navbar-margin-bottom);
    padding: var(--navbar-padding);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    transition: var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: min-width, background-color, box-shadow;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-m);

    overflow: hidden;

    &:has(:global(*):focus-visible),
    &:hover {
      width: fit-content;

      &,
      .trakt-side-navbar-content {
        min-width: var(--ni-200);
      }
    }

    /** 
      * Navbar links have custom design,
      * to accommodate the scrolled navbar
      * we need to override the button styles
      */
    :global(.trakt-button[data-style="underlined"]) {
      color: var(--color-foreground-navbar);
    }

    :global(a.trakt-link) {
      text-decoration: none;
      width: 100%;

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--purple-500);
        outline-offset: var(--gap-xs);
        border-radius: var(--border-radius-xs);
      }
    }

    :global(.trakt-link.trakt-link-active) {
      .trakt-side-navbar-link {
        color: var(--color-link-active);
      }
    }

    /* FIXME: temporary overrides until we add new components */
    :global(.trakt-filter-button),
    :global(trakt-profile-button) {
      :global(.button-label) {
        display: none;
      }
    }
  }

  .trakt-side-navbar-top,
  .trakt-side-navbar-content,
  .trakt-side-navbar-bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* FIXME: temporary overrides until we add new components */
  .trakt-side-navbar-bottom {
    gap: var(--gap-m);
    transform: scale(0.8);
    transform-origin: bottom left;
  }

  .trakt-side-navbar-content {
    gap: var(--gap-xl);
  }

  .trakt-side-navbar-link {
    color: var(--color-text-secondary);
    transition: color var(--transition-increment) ease-in-out;

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    h6 {
      white-space: nowrap;
    }

    &:hover {
      color: var(--purple-500);
    }

    :global(svg) {
      --icon-padding: var(--ni-4);

      padding: var(--icon-padding);
      width: calc(var(--navbar-item-width) - var(--icon-padding) * 2);
      height: calc(var(--navbar-item-width) - var(--icon-padding) * 2);
    }
  }
</style>
