<script lang="ts">
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-mobile-navbar">
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
    <Link href={UrlBuilder.watchlist()}>
      <div class="trakt-mobile-navbar-link">
        <WatchlistIcon />
      </div>
    </Link>
  </RenderFor>
</div>

<div class="trakt-mobile-navbar-spacer"></div>

<style>
  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    padding: var(--ni-12) 0;
    padding-bottom: calc(var(--ni-12) + env(safe-area-inset-bottom, 0));
    height: calc(var(--ni-56) + env(safe-area-inset-bottom, 0));
    box-sizing: border-box;
  }

  .trakt-mobile-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-overlay);

    background-color: var(--color-background-mobile-navbar);
    box-shadow: 0px -24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);
    backdrop-filter: blur(8px);

    display: flex;
    justify-content: center;
    gap: var(--gap-m);
  }

  .trakt-mobile-navbar-link {
    width: var(--ni-80);
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
