<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import Button from "$lib/components/buttons/Button.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { isPWA } from "$lib/utils/devices/isPWA";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { navigateToTraktOg } from "$lib/utils/url/navigateToTraktOg";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import SearchInput from "../../features/search/SearchInput.svelte";
  import FilterButton from "./components/filter/FilterButton.svelte";
  import GetVIPLink from "./components/GetVIPLink.svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import TraktLogo from "./components/TraktLogo.svelte";
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
  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
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
  <nav
    class="trakt-navbar"
    class:trakt-navbar-scroll={isScrolled}
    class:trakt-navbar-pwa={isPWA()}
  >
    <TraktLogo />

    <div class="trakt-navbar-content">
      <RenderFor
        audience="authenticated"
        device={["tablet-sm", "tablet-lg", "desktop"]}
        navigation="default"
      >
        {@render traktSwitch()}
      </RenderFor>
      <RenderFor audience="authenticated" navigation="default">
        <SearchInput />
      </RenderFor>
      <RenderFor
        audience="authenticated"
        device={["mobile"]}
        navigation="default"
      >
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
          href={UrlBuilder.lists.user()}
          label={m.navbar_link_lists_label()}
          style="underlined"
          variant="primary"
          color="purple"
        >
          {m.navbar_link_lists()}
        </Button>
      </RenderFor>
      <RenderFor audience="public">
        <JoinTraktButton />
      </RenderFor>
      <RenderFor audience="authenticated">
        {#if !isVip}
          <GetVIPLink />
        {/if}
        <FilterButton />
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
    padding: var(--navbar-vertical-padding) var(--navbar-side-padding);
  }

  .trakt-navbar-spacer {
    box-sizing: border-box;
    height: var(--navbar-height);

    @include navbar-spacing(auto);
  }

  .trakt-navbar {
    --navbar-vertical-padding: var(--ni-12);

    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    box-sizing: border-box;
    display: flex;
    width: 100dvw;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);
    padding: var(--navbar-vertical-padding) var(--layout-distance-side);

    align-items: center;
    gap: var(--gap-l);

    border-radius: var(--border-radius-m);
    transition: var(--transition-increment) ease-in-out;
    transition-property:
      padding, margin, width, background-color, box-shadow, border-radius;

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

    @include for-mobile {
      gap: var(--gap-xs);

      .trakt-navbar-content {
        gap: var(--gap-xs);
      }
    }

    &.trakt-navbar-pwa {
      border-radius: 0%;
    }
  }

  .trakt-navbar-scroll,
  .trakt-navbar-pwa {
    background-color: var(--color-background-navbar);
    @include backdrop-filter-blur(var(--ni-8));
  }

  .trakt-navbar-scroll:not(.trakt-navbar-pwa) {
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    color: var(--color-foreground-navbar);

    /** 
      * Navbar links have custom design,
      * to accommodate the scrolled navbar
      * we need to override the button styles
      */
    :global(.trakt-button[data-style="underlined"]) {
      color: var(--color-foreground-navbar);
    }

    @include backdrop-filter-blur(8px);

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

  .trakt-navbar-pwa {
    box-shadow: 0px 12px 32px 0px color-mix(in srgb, var(--color-shadow) 16%);
  }

  .trakt-navbar-scroll.trakt-navbar-pwa {
    box-shadow: 0px 24px 64px 0px color-mix(in srgb, var(--color-shadow) 32%);

    border-bottom-left-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
  }

  :global([data-mobile-os="ios"]) {
    .trakt-navbar-pwa {
      margin-top: 0;
      padding-top: calc(
        var(--navbar-vertical-padding) + env(safe-area-inset-top, 0)
      );
      height: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
    }
  }
</style>
