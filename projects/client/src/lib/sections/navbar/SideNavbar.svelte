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
            <SearchIcon />
          </Link>
        </RenderFor>

        <Link href={UrlBuilder.home()} label={m.button_label_home()}>
          <HomeIcon />
        </Link>

        <RenderFor audience="authenticated">
          <Link href={UrlBuilder.discover()} label={m.button_label_discover()}>
            <DiscoverIcon />
          </Link>

          <Link
            href={UrlBuilder.lists.user("me")}
            label={m.button_label_browse_lists()}
          >
            <ListIcon />
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
    --navbar-item-width: var(--ni-24);

    --navbar-margin: var(--gap-s);
    --navbar-margin-top: calc(var(--gap-m) + env(safe-area-inset-top));
    --navbar-margin-bottom: calc(var(--gap-m) + env(safe-area-inset-bottom));
  }

  .trakt-side-navbar {
    contain: layout;

    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    width: var(--side-navbar-width);
    height: calc(
      100dvh - var(--navbar-margin-top) - var(--navbar-margin-bottom)
    );

    color: var(--color-foreground-navbar);

    margin: var(--navbar-margin);
    margin-top: var(--navbar-margin-top);
    margin-bottom: var(--navbar-margin-bottom);
    box-sizing: border-box;

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
    align-self: center;

    gap: var(--gap-m);

    width: var(--side-navbar-width);
  }

  .trakt-side-navbar-top,
  .trakt-side-navbar-bottom {
    height: var(--side-navbar-actions-height);
    justify-content: center;
  }

  .trakt-side-navbar-content {
    gap: var(--gap-xl);

    background-color: var(--color-background-side-navbar);

    border-radius: var(--ni-60);
    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color;

    padding: var(--ni-10) 0;
  }

  .trakt-navbar-actions {
    height: var(--side-navbar-actions-height);

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
