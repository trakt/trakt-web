<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import SaveFiltersIcon from "$lib/components/icons/SaveFiltersIcon.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import CreateSmartListAction from "$lib/sections/smart-lists/CreateSmartListAction.svelte";
  import type { ListTarget } from "$lib/sections/smart-lists/models/ListTarget";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useFilterSidebar } from "$lib/stores/useFilterSidebar.ts";
  import FilterTabs from "./FilterTabs.svelte";

  const {
    onClose,
    smartListTarget,
  }: {
    onClose: () => void;
    smartListTarget?: ListTarget | Nil;
  } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { activeMode, setActiveMode, saveFilters, resetFilters } =
    useStoredFilters();
  const { hasActiveFilter } = useFilter();
  const { setDocked } = useFilterSidebar();

  $effect(() => {
    setDocked(!$isMobile);

    return () => setDocked(false);
  });
</script>

{#snippet badge()}
  <div class="trakt-filter-actions-bar">
    <div class="filter-actions">
      <Tooltip
        content={m.tooltip_reset_filters()}
        variant="compact"
        side="bottom"
      >
        <ActionButton
          label={m.button_label_reset_all_filters()}
          style="ghost"
          color="red"
          tooltip={false}
          disabled={!$hasActiveFilter}
          onclick={resetFilters}
        >
          <ResetFiltersIcon />
        </ActionButton>
      </Tooltip>
      <Tooltip
        content={m.tooltip_save_as_default()}
        variant="compact"
        side="bottom"
      >
        <ActionButton
          label={m.button_label_save_filters()}
          style="ghost"
          tooltip={false}
          onclick={() => {
            saveFilters();
            onClose();
          }}
        >
          <SaveFiltersIcon />
        </ActionButton>
      </Tooltip>
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
  dismissal={$isMobile ? "auto" : "escape-only"}
  close={$isMobile ? "default" : "anchored"}
>
  <FilterTabs activeMode={$activeMode} {setActiveMode} />

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
