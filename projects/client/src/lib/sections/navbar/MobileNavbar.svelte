<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import WatchlistIcon from "$lib/components/icons/mobile/WatchlistIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { SEARCH_INPUT_FOCUS_EVENT } from "$lib/features/search/constants";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const searchTrigger = () => {
    globalThis.window.dispatchEvent(new CustomEvent(SEARCH_INPUT_FOCUS_EVENT));
  };
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
    <Link href={UrlBuilder.lists.user()}>
      <div class="trakt-mobile-navbar-link">
        <WatchlistIcon />
      </div>
    </Link>

    <ActionButton
      label={m.button_label_search()}
      style="ghost"
      onclick={searchTrigger}
    >
      <SearchIcon />
    </ActionButton>
  </RenderFor>
</div>

<div class="trakt-mobile-navbar-spacer"></div>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  @mixin base-button-style {
    width: var(--ni-60);
    height: var(--ni-32);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    padding: var(--ni-12) 0;
    padding-bottom: calc(var(--ni-12) + env(safe-area-inset-bottom, 0));
    height: var(--mobile-navbar-height);
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

    display: flex;
    justify-content: center;
    gap: var(--gap-m);

    :global(.trakt-action-button) {
      padding: 0;

      backdrop-filter: none;
      background-color: transparent;

      @include base-button-style;
    }

    @include backdrop-filter-blur(8px);
  }

  .trakt-mobile-navbar-link {
    transition: color var(--transition-increment) ease-in-out;

    @include base-button-style;
  }

  :global(.trakt-link.trakt-link-active) {
    .trakt-mobile-navbar-link {
      color: var(--purple-400);
    }
  }
</style>
