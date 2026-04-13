<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Toast from "../../toast/Toast.svelte";
  import FilterButton from "../components/filter/FilterButton.svelte";
  import GetVIPLink from "../components/GetVIPLink.svelte";
  import JoinTraktButton from "../components/JoinTraktButton.svelte";
  import { useNavbarState } from "../useNavbarState";
  import NavbarHeader from "./NavbarHeader.svelte";

  const { state } = useNavbarState();
</script>

<div class="trakt-navbar-actions" class:is-hidden={$state.mode === "minimal"}>
  <div class="trakt-navbar-actions-left">
    <NavbarHeader />
  </div>

  <div class="trakt-navbar-actions-center">
    {#if $state.actions}
      {@render $state.actions?.()}
    {/if}
  </div>

  <div class="trakt-navbar-actions-right">
    <RenderFor audience="authenticated">
      {@render $state.sortActions?.()}
      {#if $state.seasonalActions}
        {@render $state.seasonalActions?.()}
      {/if}
      <FilterButton isDisabled={!$state.hasFilters} />
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
  .trakt-navbar-actions {
    height: var(--side-navbar-actions-height);
    transition: opacity var(--transition-increment) ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
    margin-top: env(safe-area-inset-top);
    padding-left: calc(
      var(--layout-distance-side) + var(--layout-sidebar-distance)
    );

    &.is-hidden {
      height: 0;
      opacity: 0;
      padding-block: 0;
      pointer-events: none;
    }
  }

  .trakt-navbar-actions-left {
    min-width: 0;
  }

  .trakt-navbar-actions-right {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
