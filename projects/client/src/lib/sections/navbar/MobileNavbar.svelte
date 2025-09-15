<script lang="ts">
  import { page } from "$app/state";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { isMobileAppleDevice } from "$lib/utils/devices/isMobileAppleDevice";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import NavbarSearch from "./components/_internal/NavbarSearch.svelte";

  const isOnSearchPage = $derived(page.route.id === UrlBuilder.search());
  const showSearchInNavbar = $derived(!isMobileAppleDevice() && isOnSearchPage);
</script>

<div class="trakt-mobile-navbar" class:has-search={showSearchInNavbar}>
  {#if showSearchInNavbar}
    <NavbarSearch />
  {/if}

  <div class="trakt-mobile-navbar-links">
    <Link href={UrlBuilder.home()}>
      <div class="trakt-mobile-navbar-link">
        <HomeIcon />
      </div>
    </Link>

    <Link href={UrlBuilder.shows()}>
      <div class="trakt-mobile-navbar-link">
        <ShowIcon />
      </div>
    </Link>

    <Link href={UrlBuilder.movies()}>
      <div class="trakt-mobile-navbar-link">
        <MovieIcon />
      </div>
    </Link>

    <RenderFor audience="authenticated">
      <Link href={UrlBuilder.lists.user()}>
        <div class="trakt-mobile-navbar-link">
          <WatchlistIcon />
        </div>
      </Link>
    </RenderFor>

    <RenderFor audience="authenticated">
      <Link href={UrlBuilder.search()}>
        <div class="trakt-mobile-navbar-link">
          <SearchIcon />
        </div>
      </Link>
    </RenderFor>
  </div>
</div>

<div class="trakt-mobile-navbar-spacer"></div>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    padding: var(--ni-12) 0;
    padding-bottom: calc(var(--ni-12) + env(safe-area-inset-bottom, 0));
    height: var(--mobile-navbar-height);
    box-sizing: border-box;
  }

  .trakt-mobile-navbar {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-overlay);

    background-color: var(--color-background-mobile-navbar);
    box-shadow: 0px -24px 64px 0px var(--cm-shadow-32);

    border-top-left-radius: var(--border-radius-xxl);
    border-top-right-radius: var(--border-radius-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: height, gap;

    &.has-search {
      --search-height: calc(var(--ni-104) + var(--gap-m));

      gap: var(--gap-m);
      height: calc(var(--mobile-navbar-height) + var(--search-height));
    }

    backdrop-filter: blur(var(--ni-8));
  }

  .trakt-mobile-navbar-links {
    flex-shrink: 0;

    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--gap-s);

    height: var(--ni-32);
  }

  .trakt-mobile-navbar-link {
    width: var(--ni-60);
    transition: color var(--transition-increment) ease-in-out;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  :global(.trakt-link.trakt-link-active) {
    .trakt-mobile-navbar-link {
      color: var(--purple-400);
    }
  }
</style>
