<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { trackWindowScrollDirection } from "$lib/utils/actions/trackWindowScrollDirection";
  import Greeting from "./_internal/Greeting.svelte";
  import FilterButton from "./filter/FilterButton.svelte";
  import JoinTraktButton from "./JoinTraktButton.svelte";
  import ProfileLink from "./ProfileLink.svelte";
</script>

<header>
  <nav
    class="trakt-navbar"
    use:trackWindowScroll={"trakt-navbar-scroll"}
    use:trackWindowScrollDirection={{
      up: "trakt-navbar-scroll-up",
      down: "trakt-navbar-scroll-down",
    }}
  >
    <div class="trakt-navbar-content">
      <Greeting />
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
    transition-property: width, background-color, box-shadow, top, opacity;

    .trakt-navbar-links {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
      justify-content: end;
    }

    &:global(.trakt-navbar-scroll) {
      background-color: var(--color-background-navbar);
      box-shadow: 0px 24px 64px 0px var(--cm-shadow-32);

      @include backdrop-filter-blur(var(--ni-8));
    }

    &:global(.trakt-navbar-scroll),
    &:global(.trakt-navbar-scroll-down) {
      top: var(--offscreen-top);
      opacity: 0;
    }

    &:global(.trakt-navbar-scroll-up) {
      top: 0;
      opacity: 1;
    }

    @include for-mobile {
      gap: var(--gap-xs);
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
