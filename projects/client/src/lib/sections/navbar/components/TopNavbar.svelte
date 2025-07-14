<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { isPWA } from "$lib/utils/devices/isPWA";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { onMount } from "svelte";
  import FilterButton from "./filter/FilterButton.svelte";
  import GetVIPLink from "./GetVIPLink.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";
  import ProfileButton from "./ProfileButton.svelte";
  import TraktLogo from "./TraktLogo.svelte";

  let windowScrollY = $state(0);
  const isScrolled = $derived(windowScrollY > 0);

  function handleScroll() {
    windowScrollY = window.scrollY;
  }

  onMount(() => {
    handleScroll();
    return GlobalEventBus.getInstance().register("scroll", handleScroll);
  });

  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
</script>

<header>
  <nav
    class="trakt-navbar"
    class:trakt-navbar-scroll={isScrolled}
    class:trakt-navbar-pwa={isPWA()}
  >
    <TraktLogo />

    <div class="trakt-navbar-content">
      <RenderFor audience="authenticated" navigation="default">
        <SearchInput />
      </RenderFor>
    </div>

    <div class="trakt-navbar-links">
      <RenderFor audience="public">
        <JoinTraktButton size="small" />
      </RenderFor>
      <RenderFor audience="authenticated">
        {#if !isVip}
          <GetVIPLink />
        {/if}
        <FilterButton size="small" />
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

    @include backdrop-filter-blur(8px);

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
