<script lang="ts">
  import { page } from "$app/state";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { trackWindowScrollDirection } from "$lib/utils/actions/trackWindowScrollDirection";
  import { NOOP_FN } from "$lib/utils/constants";
  import { HIDDEN_ROUTE_IDS } from "./_internal/constants";
  import Greeting from "./_internal/Greeting.svelte";
  import FilterButton from "./filter/FilterButton.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";
  import ProfileLink from "./ProfileLink.svelte";

  const isHiddenRoute = $derived(
    HIDDEN_ROUTE_IDS.includes(page.route.id ?? ""),
  );
  const { isAuthorized } = useAuth();
  const isHidden = $derived(isHiddenRoute && $isAuthorized);

  const { mode: selectedType, setMode, options, routes } = useDiscover();
  const isOnDiscoverablePage = $derived($routes.includes(page.route.id ?? ""));

  const { isEnabled } = $derived(useFeatureFlag(FeatureFlag.Discover));
  const scrollDirectionTracker = $derived(
    $isEnabled ? NOOP_FN : trackWindowScrollDirection,
  );
</script>

<header>
  <nav
    class="trakt-navbar"
    class:is-authorized={$isAuthorized}
    class:is-hidden={isHidden}
    use:trackWindowScroll={"trakt-navbar-scroll"}
    use:scrollDirectionTracker={{
      upClassName: "trakt-navbar-scroll-up",
      downClassName: "trakt-navbar-scroll-down",
      offsetVar: "var(--navbar-height)",
    }}
  >
    <div class="trakt-navbar-content">
      <RenderForFeature flag={FeatureFlag.Discover}>
        {#snippet enabled()}
          {#if isOnDiscoverablePage}
            <Toggler
              value={$selectedType}
              variant="text"
              onChange={setMode}
              {options}
            />
          {:else}
            <Greeting />
          {/if}
        {/snippet}

        <Greeting />
      </RenderForFeature>
    </div>

    <div class="trakt-navbar-links">
      <RenderFor audience="public">
        <JoinTraktButton size="small">
          {#snippet icon()}
            <PlusIcon />
          {/snippet}
        </JoinTraktButton>
      </RenderFor>
      <RenderFor audience="authenticated">
        <RenderForFeature flag={FeatureFlag.Discover}>
          {#snippet enabled()}
            {#if isOnDiscoverablePage}
              <FilterButton size="small" />
            {/if}
          {/snippet}
          <FilterButton size="small" />
          <ProfileLink />
        </RenderForFeature>
      </RenderFor>
    </div>
  </nav>

  <div class="trakt-navbar-spacer" class:is-hidden={isHidden}></div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-navbar-spacer {
    box-sizing: border-box;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);
    margin-bottom: var(--ni-12);

    transition: height calc(2 * var(--transition-increment)) ease-in-out;

    &.is-hidden {
      margin: 0;
      height: calc(var(--gap-m) + env(safe-area-inset-top));
    }
  }

  .trakt-navbar {
    --navbar-vertical-padding: var(--ni-12);
    --offscreen-top: calc(
      -1 * (var(--navbar-height) + env(safe-area-inset-top, 0))
    );

    z-index: var(--layer-overlay);
    position: fixed;
    top: 0;
    left: 0;

    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    width: 100dvw;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);
    padding: var(--navbar-vertical-padding) var(--layout-distance-side);

    align-items: center;
    gap: var(--gap-l);

    border-radius: 0%;
    border-bottom-left-radius: var(--border-radius-xxl);
    border-bottom-right-radius: var(--border-radius-xxl);

    transition: calc(2 * var(--transition-increment)) ease-in-out;
    transition-property:
      height, width, background-color, box-shadow, top, opacity;

    .trakt-navbar-links {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
      justify-content: end;
    }

    &:global(.trakt-navbar-scroll) {
      background-color: var(--color-background-navbar);
      box-shadow: 0px 24px 64px 0px var(--cm-shadow-32);

      backdrop-filter: blur(var(--ni-8));
    }

    &:not(.is-hidden).is-authorized {
      &:global(.trakt-navbar-scroll-down) {
        top: var(--offscreen-top);
        opacity: 0;
      }

      &:global(.trakt-navbar-scroll-up) {
        top: 0;
        opacity: 1;
      }
    }

    &.is-hidden {
      height: 0;
      opacity: 0;
      pointer-events: none;
    }

    @include for-mobile {
      gap: var(--gap-xs);
    }
  }

  :global([data-mobile-os="ios"]) {
    .trakt-navbar:not(.is-hidden) {
      margin-top: 0;
      padding-top: calc(
        var(--navbar-vertical-padding) + env(safe-area-inset-top, 0)
      );
      height: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
    }

    .trakt-navbar-spacer:not(.is-hidden) {
      height: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
      margin-top: 0;
    }
  }
</style>
