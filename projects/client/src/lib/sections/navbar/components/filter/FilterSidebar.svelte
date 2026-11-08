<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import StoredFilterActions from "$lib/features/filters/StoredFilterActions.svelte";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import CreateSmartListAction from "$lib/sections/smart-lists/CreateSmartListAction.svelte";
  import type { ListTarget } from "$lib/sections/smart-lists/models/ListTarget";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import FilterTabs from "./FilterTabs.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";

  const {
    onClose,
    smartListTarget,
  }: {
    onClose: () => void;
    smartListTarget?: ListTarget | Nil;
  } = $props();

  const { activeMode, setActiveMode, saveFilters, resetFilters } =
    useStoredFilters();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isSmallTablet = useMedia(WellKnownMediaQuery.tabletSmall);

  const tabPosition = $derived($isMobile || $isSmallTablet ? "bottom" : "top");
</script>

{#snippet badge()}
  <div class="trakt-filter-actions-bar">
    <div class="filter-actions">
      <StoredFilterActions
        onReset={resetFilters}
        onSave={() => {
          saveFilters();
          onClose();
        }}
      />
    </div>
    <DiscoverToggles variant="compact" />
  </div>
{/snippet}

<Drawer
  {onClose}
  {badge}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <FilterTabs activeMode={$activeMode} {setActiveMode} {tabPosition} />

  {#if smartListTarget}
    <RenderFor audience="authenticated">
      <CreateSmartListAction target={smartListTarget} />
    </RenderFor>
  {/if}
</Drawer>

<style>
  .trakt-filter-actions-bar {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);
    justify-content: space-between;
    flex: 1;
  }

  .filter-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);
  }
</style>
