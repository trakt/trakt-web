<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import FilterButton from "./filter/FilterButton.svelte";
  import GetVIPLink from "./GetVIPLink.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";
  import ProfileLink from "./ProfileLink.svelte";
  import TraktLogo from "./TraktLogo.svelte";

  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
</script>

<header>
  <nav class="trakt-navbar" use:trackWindowScroll={"trakt-navbar-scroll"}>
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
        <ProfileLink />
      </RenderFor>
    </div>
  </nav>

  <div class="trakt-navbar-spacer"></div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-navbar-spacer {
    box-sizing: border-box;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);
    margin-bottom: var(--ni-12);
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

    border-radius: 0%;
    transition: var(--transition-increment) ease-in-out;
    transition-property: width, background-color, box-shadow, border-radius;

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

    &:global(.trakt-navbar-scroll) {
      background-color: var(--color-background-navbar);

      border-bottom-left-radius: var(--border-radius-xxl);
      border-bottom-right-radius: var(--border-radius-xxl);

      box-shadow: 0px 24px 64px 0px var(--cm-shadow-32);

      @include backdrop-filter-blur(var(--ni-8));
    }

    @include for-mobile {
      gap: var(--gap-xs);

      .trakt-navbar-content {
        gap: var(--gap-xs);
      }
    }
  }

  :global([data-mobile-os="ios"]) {
    .trakt-navbar {
      margin-top: 0;
      padding-top: calc(
        var(--navbar-vertical-padding) + env(safe-area-inset-top, 0)
      );
      height: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
    }

    .trakt-navbar-spacer {
      height: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
      margin-top: 0;
    }
  }
</style>
