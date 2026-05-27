<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useNavbarState } from "$lib/sections/navbar/useNavbarState";
  import FiltersPopupMenu from "./filters/FiltersPopupMenu.svelte";
  import FilterTabs from "./FilterTabs.svelte";

  const {
    onClose,
    hasAutoClose = true,
    onSaveFilter = onClose,
  }: {
    onClose: () => void;
    /**
     * Forwarded to the underlying `Drawer`. Defaults to `true` (overlay
     * portal + underlay). Pass `false` to render inline so the drawer
     * sits within a parent grid cell (e.g. the docked calendar sidebar) —
     * mirrors the `SmartListCreator` pattern.
     */
    hasAutoClose?: boolean;
    /**
     * Fires after the user saves a filter preset from the popup menu.
     * Defaults to `onClose` so the overlay drawer closes after saving.
     * Pass a no-op when rendered inline so the panel stays put.
     */
    onSaveFilter?: () => void;
  } = $props();

  const { activeMode, setActiveMode } = useStoredFilters();

  const { state } = useNavbarState();
  const filterPanelHeader = $derived($state.filterPanelHeader);

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isSmallTablet = useMedia(WellKnownMediaQuery.tabletSmall);

  const tabPosition = $derived($isMobile || $isSmallTablet ? "bottom" : "top");
</script>

{#snippet badge()}
  <div class="trakt-filter-toggles">
    <DiscoverToggles />
  </div>

  {#if $activeMode === FilterMode.Simple}
    <FiltersPopupMenu onClose={onSaveFilter} />
  {/if}
{/snippet}

<Drawer
  {onClose}
  {badge}
  {hasAutoClose}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  {#if filterPanelHeader}
    <div class="trakt-filter-panel-header">
      {@render filterPanelHeader()}
    </div>
  {/if}

  <FilterTabs activeMode={$activeMode} {setActiveMode} {tabPosition} />
</Drawer>

<style>
  .trakt-filter-toggles {
    display: flex;
  }

  .trakt-filter-panel-header {
    display: flex;
    flex-direction: column;

    padding-bottom: var(--gap-m);
  }
</style>
