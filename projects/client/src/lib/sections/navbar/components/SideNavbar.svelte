<script lang="ts">
  import { browser } from "$app/environment";
  import { TestId } from "$e2e/models/TestId";
  import Button from "$lib/components/buttons/Button.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import BetaBadge from "./BetaBadge.svelte";
  import FilterButton from "./filter/FilterButton.svelte";
  import GetVIPLink from "./GetVIPLink.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";
  import ProfileLink from "./ProfileLink.svelte";
  import TraktLogo from "./TraktLogo.svelte";

  const isTV = $derived(browser && getDeviceType(navigator.userAgent) === "tv");
  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const { navigation } = useNavigation();

  const forceCollapse = writable(false);
  const canExpand = $derived($isMouse || $navigation === "dpad");
</script>

<header>
  <nav
    class="trakt-side-navbar"
    class:can-expand={canExpand}
    class:force-collapse={$forceCollapse}
    data-dpad-navigation={DpadNavigationType.Navbar}
    onpointerleave={() => forceCollapse.set(false)}
  >
    <div class="trakt-side-navbar-top">
      <TraktLogo />
      {#if isTV}
        <BetaBadge />
      {/if}
    </div>

    <div class="trakt-side-navbar-content">
      <RenderFor audience="authenticated" navigation="default">
        <Button
          href={UrlBuilder.search()}
          label={m.button_label_search()}
          style="flat"
          variant="secondary"
          color="purple"
          onclick={() => forceCollapse.set(true)}
        >
          {m.button_text_search()}
          {#snippet icon()}
            <SearchIcon />
          {/snippet}
        </Button>
      </RenderFor>

      <Button
        href={UrlBuilder.home()}
        label={m.button_label_home()}
        style="flat"
        variant="secondary"
        color="purple"
        data-testid={TestId.NavBarHomeButton}
        navigationType={DpadNavigationType.Item}
      >
        {m.button_text_home()}
        {#snippet icon()}
          <HomeIcon />
        {/snippet}
      </Button>
      <Button
        href={UrlBuilder.shows()}
        label={m.button_label_browse_shows()}
        style="flat"
        variant="secondary"
        color="purple"
        data-testid={TestId.NavBarShowsButton}
        navigationType={DpadNavigationType.Item}
      >
        {m.button_text_browse_shows()}
        {#snippet icon()}
          <ShowIcon />
        {/snippet}
      </Button>
      <Button
        href={UrlBuilder.movies()}
        label={m.button_label_browse_movies()}
        style="flat"
        variant="secondary"
        color="purple"
        data-testid={TestId.NavBarMoviesButton}
        navigationType={DpadNavigationType.Item}
      >
        {m.button_text_browse_movies()}
        {#snippet icon()}
          <MovieIcon />
        {/snippet}
      </Button>

      <RenderFor audience="authenticated">
        <Button
          href={UrlBuilder.lists.user()}
          label={m.button_label_browse_lists()}
          style="flat"
          variant="secondary"
          color="purple"
          navigationType={DpadNavigationType.Item}
        >
          {m.button_text_browse_lists()}
          {#snippet icon()}
            <WatchlistIcon />
          {/snippet}
        </Button>
      </RenderFor>
      <!-- FIXME: make settings page dpad navigate-able -->
      <RenderFor audience="authenticated" navigation="default">
        <Button
          href={UrlBuilder.settings()}
          label={m.button_label_settings()}
          style="flat"
          variant="secondary"
          color="purple"
          navigationType={DpadNavigationType.Item}
        >
          {m.button_text_settings()}
          {#snippet icon()}
            <GearIcon />
          {/snippet}
        </Button>
      </RenderFor>
    </div>

    <div class="trakt-side-navbar-bottom">
      <RenderFor audience="authenticated">
        <RenderFor audience="authenticated" navigation="dpad">
          <LocalePicker />
        </RenderFor>
        <FilterButton size="normal" />
        {#if !isVip}
          <RenderFor audience="authenticated" navigation="default">
            <GetVIPLink />
          </RenderFor>
        {/if}
        <ProfileLink />
      </RenderFor>
      <RenderFor audience="public">
        <JoinTraktButton size="normal">
          {#snippet icon()}
            <CircularLogo variant="gradient" />
          {/snippet}
        </JoinTraktButton>
      </RenderFor>
    </div>
  </nav>
</header>

<style lang="scss">
  @mixin collapsed-states($opacity, $display) {
    :global(.trakt-tagline),
    :global(.trakt-button .button-label),
    :global(trakt-profile-button .profile-info),
    :global(.trakt-logo .trakt-logo-text) {
      opacity: $opacity;
      transition: opacity var(--transition-increment) ease-in-out;
    }

    :global(trakt-get-vip-link p) {
      display: $display;
    }
  }

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
    --navbar-expanded-min-width: var(--ni-200);
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
    box-shadow: var(--ni-0) var(--ni-24) var(--ni-64) var(--ni-0)
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

    @include collapsed-states(0, none);

    :global(.locale-picker-container) {
      width: var(--navbar-item-width);
      height: var(--navbar-item-width);
    }

    :global(trakt-get-vip-link) {
      display: flex;
      justify-content: center;
      min-width: var(--navbar-item-width);

      :global(.trakt-vip-badge) {
        padding: var(--ni-8);
        transition: padding var(--transition-increment) ease-in-out;
      }
    }

    :global(.trakt-button),
    :global(trakt-profile-button) {
      min-width: var(--navbar-expanded-min-width);
    }

    :global(.trakt-button-link.trakt-link-active) {
      color: var(--color-foreground-button);
    }

    :global(.trakt-button) {
      flex-direction: row-reverse;
      margin-left: var(--ni-neg-12);

      color: var(--color-text-primary);
      background: none;

      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color, color;

      :global(.button-label) {
        flex: 1;
      }
    }
  }

  .trakt-side-navbar.can-expand {
    &:has(:global(*):focus-visible),
    &:not(.force-collapse):hover {
      width: fit-content;

      &,
      .trakt-side-navbar-content {
        min-width: var(--navbar-expanded-min-width);
      }

      @include collapsed-states(1, initial);

      :global(trakt-get-vip-link) {
        :global(.trakt-vip-badge) {
          padding-left: var(--ni-12);
          padding-right: var(--ni-12);
        }
      }

      :global(.trakt-button) {
        &:focus-visible {
          outline: var(--border-thickness-xs) solid
            var(--color-background-button);
          color: var(--color-background-button);
        }
      }
    }

    &:not(.force-collapse) {
      :global(.trakt-button):hover {
        color: var(--color-foreground-button);
        background-color: var(--color-background-button);
      }
    }
  }

  .trakt-side-navbar-top,
  .trakt-side-navbar-content,
  .trakt-side-navbar-bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    gap: var(--gap-m);
  }

  .trakt-side-navbar-top {
    color: var(--color-foreground);

    flex-direction: row;
    align-items: center;
  }

  .trakt-side-navbar-content {
    gap: var(--gap-xs);
  }
</style>
