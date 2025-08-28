<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";

  const hasSearch = writable(false);
</script>

<div class="trakt-mobile-navbar" class:has-search={$hasSearch}>
  {#if $hasSearch}
    <div class="trakt-mobile-navbar-search">
      <SearchInput />
    </div>
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
      <ActionButton
        label="TODO"
        onclick={() => hasSearch.update((v) => !v)}
        style="ghost"
        variant="primary"
      >
        <SearchIcon />
      </ActionButton>
    </RenderFor>
  </div>
</div>

<div class="trakt-mobile-navbar-spacer" class:has-search={$hasSearch}></div>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    padding: var(--ni-12) 0;
    padding-bottom: calc(var(--ni-12) + env(safe-area-inset-bottom, 0));
    height: var(--mobile-navbar-height);
    box-sizing: border-box;

    transition: height var(--transition-increment) ease-in-out;

    &.has-search {
      height: calc(
        var(--mobile-navbar-height) + var(--ni-48) + var(--gap-xs) +
          var(--ni-32)
      );
    }
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

    &.has-search {
      gap: var(--gap-xs);
    }

    @include backdrop-filter-blur(8px);
  }

  .trakt-mobile-navbar-search {
    padding: var(--ni-16);
  }

  .trakt-mobile-navbar-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--gap-m);

    height: var(--ni-40);
  }

  .trakt-mobile-navbar-link {
    width: var(--ni-64);
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
