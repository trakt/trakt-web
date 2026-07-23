<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import EditModeBar from "$lib/features/edit-mode/EditModeBar.svelte";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import NavbarHeader from "./_internal/NavbarHeader.svelte";
  import FilterButton from "./components/filter/FilterButton.svelte";
  import GetVIPLink from "./components/GetVIPLink.svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import { useNavbarState } from "./useNavbarState";

  const { state } = useNavbarState();

  const { isEditMode } = useEditMode();
</script>

{#if $state.mode !== "hidden" || $isEditMode}
  <header>
    <nav
      class="trakt-navbar"
      class:is-hidden={$state.mode === "minimal" && !$isEditMode}
      class:is-edit-mode={$isEditMode}
      use:trackWindowScroll={"trakt-navbar-scroll"}
    >
      <div class="trakt-navbar-left">
        <NavbarHeader />
        {#if $isEditMode}
          <EditModeBar />
        {:else}
          {@render $state.actions?.()}
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
          {#if !$isEditMode}
            {@render $state.headerActions?.()}
            {#if $state.showFilters}
              <FilterButton isDisabled={!$state.hasFilters} />
            {/if}
          {/if}
        </RenderFor>
        <RenderFor audience="free"><GetVIPLink source="navbar" /></RenderFor>
      </div>
    </nav>

    <div
      class="trakt-navbar-spacer"
      class:is-hidden={$state.mode === "minimal" && !$isEditMode}
    ></div>
  </header>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-navbar-spacer {
    box-sizing: border-box;
    height: var(--navbar-height);

    margin-top: env(safe-area-inset-top);

    &.is-hidden {
      margin: 0;
      height: env(safe-area-inset-top);
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
    inset-inline-start: 0;

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
    border-end-start-radius: var(--border-radius-xxl);
    border-end-end-radius: var(--border-radius-xxl);

    transition: calc(2 * var(--transition-increment)) ease-in-out;
    transition-property: width, top, opacity;

    .trakt-navbar-left {
      min-width: 0;
    }

    .trakt-navbar-links {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
      justify-content: end;
    }

    &:global(.trakt-navbar-scroll) {
      &::before {
        content: "";
        position: absolute;
        inset-block: 0;
        left: 50%;
        z-index: -1;

        width: 100dvw;
        transform: translateX(-50%);

        border-end-start-radius: var(--border-radius-xxl);
        border-end-end-radius: var(--border-radius-xxl);
        background-color: var(--color-background-navbar);
        box-shadow: var(--shadow-navbar);
        backdrop-filter: var(--filter-surface-blur, blur(var(--ni-8)));

        transition: calc(2 * var(--transition-increment)) ease-in-out;
        transition-property: background-color, box-shadow;
      }
    }

    :global(:root[data-reduced-visual-noise])
      &:global(.trakt-navbar-scroll)::before {
      background-color: var(--color-background-top-navbar);
      backdrop-filter: var(--filter-background-top-navbar);
    }

    &.is-hidden {
      height: 0;
      opacity: 0;
      pointer-events: none;
    }

    &.is-edit-mode {
      justify-content: center;
    }

    :global(:root[data-reduced-width]) & {
      inset-inline: 0;
      width: min(100dvw, var(--layout-page-max-width));
      margin-inline: auto;
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
