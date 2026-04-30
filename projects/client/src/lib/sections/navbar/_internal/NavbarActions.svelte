<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import ExitEditModeButton from "$lib/features/edit-mode/ExitEditModeButton.svelte";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import Toast from "../../toast/Toast.svelte";
  import FilterButton from "../components/filter/FilterButton.svelte";
  import GetVIPLink from "../components/GetVIPLink.svelte";
  import JoinTraktButton from "../components/JoinTraktButton.svelte";
  import { useNavbarState } from "../useNavbarState";
  import NavbarHeader from "./NavbarHeader.svelte";

  const { state } = useNavbarState();

  const { isEditMode } = useEditMode();
</script>

<div
  class="trakt-navbar-actions"
  class:is-hidden={$state.mode === "minimal"}
  use:trackElementBottom={"--navbar-actions-bottom"}
  use:trackWindowScroll={"trakt-navbar-actions-scroll"}
>
  <div class="trakt-navbar-actions-left">
    <NavbarHeader />
  </div>

  <div class="trakt-navbar-actions-center">
    {#if $isEditMode}
      <ExitEditModeButton />
    {:else}
      {@render $state.actions?.()}
    {/if}
  </div>

  <div class="trakt-navbar-actions-right">
    <RenderFor audience="authenticated">
      {@render $state.headerActions?.()}
      {#if $state.showFilters}
        <FilterButton isDisabled={!$state.hasFilters} />
      {/if}
    </RenderFor>
    <RenderFor audience="free"><GetVIPLink source="navbar" /></RenderFor>
    <RenderFor audience="public">
      <JoinTraktButton size="small">
        {#snippet icon()}
          <CircularLogo />
        {/snippet}
      </JoinTraktButton>
    </RenderFor>
  </div>
</div>

<div
  class="trakt-navbar-actions-spacer"
  class:is-hidden={$state.mode === "minimal"}
></div>

{#if $state.toastActions || $state.contextualActions}
  <Toast>
    {#if $state.contextualActions}
      {@render $state.contextualActions()}
    {:else}
      {@render $state.toastActions?.()}
    {/if}
  </Toast>
{/if}

<style>
  .trakt-navbar-actions,
  .trakt-navbar-actions-spacer {
    --navbar-actions-height: calc(
      var(--side-navbar-actions-height) + var(--gap-m) + var(--gap-m) +
        env(safe-area-inset-top, 0)
    );

    height: var(--navbar-actions-height);
    box-sizing: border-box;
  }

  .trakt-navbar-actions {
    transition: var(--transition-increment) ease-in-out;
    transition-property: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-overlay);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
    margin-top: env(safe-area-inset-top);
    padding-left: calc(
      var(--layout-distance-side) + var(--layout-sidebar-distance)
    );

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-increment) ease-in-out;
    }

    &::before {
      backdrop-filter: blur(var(--ni-10));
      background: color-mix(
        in srgb,
        var(--color-background-navbar) 75%,
        transparent
      );
      mask-image: linear-gradient(
        to bottom,
        black 0%,
        color-mix(in srgb, black 99%, transparent) 10%,
        color-mix(in srgb, black 95%, transparent) 20%,
        color-mix(in srgb, black 89%, transparent) 30%,
        color-mix(in srgb, black 81%, transparent) 40%,
        color-mix(in srgb, black 71%, transparent) 50%,
        color-mix(in srgb, black 59%, transparent) 60%,
        color-mix(in srgb, black 45%, transparent) 70%,
        color-mix(in srgb, black 31%, transparent) 80%,
        color-mix(in srgb, black 16%, transparent) 90%,
        transparent 100%
      );
    }

    &:global(.trakt-navbar-actions-scroll)::before {
      opacity: 1;
    }

    &.is-hidden {
      height: 0;
      opacity: 0;
      padding-block: 0;
      pointer-events: none;
    }
  }

  .trakt-navbar-actions-spacer.is-hidden {
    height: 0;
  }

  .trakt-navbar-actions-left {
    min-width: 0;
  }

  .trakt-navbar-actions-left,
  .trakt-navbar-actions-center,
  .trakt-navbar-actions-right {
    position: relative;
    z-index: 1;
  }

  .trakt-navbar-actions-right {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
