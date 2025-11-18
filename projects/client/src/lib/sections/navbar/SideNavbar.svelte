<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Toast from "../toast/Toast.svelte";
  import FilterButton from "./components/filter/FilterButton.svelte";
  import GetVIPLink from "./components/GetVIPLink.svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import ProfileLink from "./components/ProfileLink.svelte";
  import TraktLogo from "./components/TraktLogo.svelte";
  import { useNavbarState } from "./useNavbarState";

  const { state } = useNavbarState();
</script>

{#if $state.mode !== "hidden"}
  <div class="trakt-navbar-actions">
    <div class="trakt-navbar-actions-left">
      <RenderFor audience="free"><GetVIPLink /></RenderFor>
    </div>

    <div class="trakt-navbar-actions-center">
      {#if $state.actions || $state.seasonalActions}
        {@render $state.actions?.()}
        {@render $state.seasonalActions?.()}
      {/if}
    </div>

    <div class="trakt-navbar-actions-right">
      <RenderFor audience="authenticated">
        <FilterButton isDisabled={!$state.hasFilters} />
      </RenderFor>
      <RenderFor audience="public">
        <JoinTraktButton size="small">
          {#snippet icon()}
            <CircularLogo />
          {/snippet}
        </JoinTraktButton>
      </RenderFor>
    </div>
  </div>

  {#if $state.toastActions || $state.contextualActions}
    <Toast>
      {#if $state.contextualActions}
        {@render $state.contextualActions()}
      {:else}
        {@render $state.toastActions?.()}
      {/if}
    </Toast>
  {/if}

  <header>
    <nav
      class="trakt-side-navbar"
      data-dpad-navigation={DpadNavigationType.Navbar}
    >
      <div class="trakt-side-navbar-top">
        <TraktLogo />
      </div>

      <div class="trakt-side-navbar-content">
        <RenderFor audience="authenticated">
          <Link href={UrlBuilder.search()} label={m.button_label_search()}>
            <div class="trakt-mobile-navbar-link">
              <SearchIcon />
            </div>
          </Link>
        </RenderFor>

        <Link href={UrlBuilder.home()} label={m.button_label_home()}>
          <div class="trakt-mobile-navbar-link">
            <HomeIcon />
          </div>
        </Link>

        <RenderFor audience="authenticated">
          <Link href={UrlBuilder.discover()} label={m.button_label_discover()}>
            <div class="trakt-mobile-navbar-link">
              <DiscoverIcon />
            </div>
          </Link>

          <Link
            href={UrlBuilder.lists.user("me")}
            label={m.button_label_browse_lists()}
          >
            <div class="trakt-mobile-navbar-link">
              <ListIcon />
            </div>
          </Link>
        </RenderFor>
      </div>

      <div class="trakt-side-navbar-bottom">
        <RenderFor audience="authenticated">
          <ProfileLink />
        </RenderFor>
      </div>
    </nav>
  </header>
{/if}

<style lang="scss">
  header {
    --navbar-padding: var(--ni-16);
    --navbar-item-width: var(--ni-32);

    --navbar-width: calc(var(--navbar-item-width) + var(--navbar-padding) * 2);

    --navbar-margin: var(--gap-s);
    --navbar-margin-top: calc(var(--gap-m) + env(safe-area-inset-top));
    --navbar-margin-bottom: calc(var(--gap-m) + env(safe-area-inset-bottom));

    --navbar-button-offset: var(--ni-neg-12);
  }

  .trakt-side-navbar {
    contain: layout;

    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    width: var(--navbar-width);
    height: calc(
      100dvh - var(--navbar-margin-top) - var(--navbar-margin-bottom)
    );

    background-color: var(--color-background-navbar);
    box-shadow: var(--ni-0) var(--ni-24) var(--ni-64) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 32%, transparent);

    backdrop-filter: blur(8px);
    color: var(--color-foreground-navbar);

    margin: var(--navbar-margin);
    margin-top: var(--navbar-margin-top);
    margin-bottom: var(--navbar-margin-bottom);
    padding: var(--navbar-padding);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, box-shadow;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-m);

    overflow: hidden;
  }

  .trakt-side-navbar-top,
  .trakt-side-navbar-content,
  .trakt-side-navbar-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-m);

    width: calc(var(--navbar-width) - 2 * var(--navbar-padding));
  }

  .trakt-side-navbar-top {
    color: var(--color-foreground);

    flex-direction: row;
    align-items: center;
  }

  .trakt-side-navbar-content {
    gap: var(--gap-xl);
  }

  .trakt-navbar-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: var(--gap-m);

    padding: var(--gap-m);
    margin-top: env(safe-area-inset-top);

    padding-left: calc(
      var(--layout-distance-side) + var(--layout-sidebar-distance)
    );
  }
</style>
