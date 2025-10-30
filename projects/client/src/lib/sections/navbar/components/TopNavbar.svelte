<script lang="ts">
  import { page } from "$app/state";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import SeasonalToggle from "$lib/features/theme/components/SeasonalToggle.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { HIDDEN_ROUTE_IDS } from "./_internal/constants";
  import Greeting from "./_internal/Greeting.svelte";
  import FilterButton from "./filter/FilterButton.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";

  const isHiddenRoute = $derived(
    HIDDEN_ROUTE_IDS.includes(page.route.id ?? ""),
  );
  const { isAuthorized } = useAuth();
  const isHidden = $derived(isHiddenRoute && $isAuthorized);

  const { mode: selectedType, setMode, options, routes } = useDiscover();
  const isOnDiscoverablePage = $derived($routes.includes(page.route.id ?? ""));
</script>

<header>
  <nav
    class="trakt-navbar"
    class:is-authorized={$isAuthorized}
    class:is-hidden={isHidden}
    use:trackWindowScroll={"trakt-navbar-scroll"}
  >
    <div class="trakt-navbar-content">
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
        <SeasonalToggle />
        <FilterButton size="small" />
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
