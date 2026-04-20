<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import FiltersPopupMenu from "./filters/FiltersPopupMenu.svelte";
  import FilterTabs from "./FilterTabs.svelte";

  const { onClose }: { onClose: () => void } = $props();

  const { activeMode, setActiveMode } = useStoredFilters();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isSmallTablet = useMedia(WellKnownMediaQuery.tabletSmall);

  const tabPosition = $derived($isMobile || $isSmallTablet ? "bottom" : "top");
</script>

{#snippet badge()}
  <div class="trakt-filter-toggles">
    <DiscoverToggles />
  </div>

  {#if $activeMode === FilterMode.Simple}
    <FiltersPopupMenu {onClose} />
  {/if}
{/snippet}

<Drawer
  {onClose}
  {badge}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <FilterTabs activeMode={$activeMode} {setActiveMode} {tabPosition} />
</Drawer>

<style>
  .trakt-filter-toggles {
    display: flex;
  }
</style>
