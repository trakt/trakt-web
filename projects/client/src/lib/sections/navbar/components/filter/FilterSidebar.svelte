<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import FilterGroup from "./filters/_internal/FilterGroup.svelte";
  import AdvancedFilters from "./filters/AdvancedFilters.svelte";
  import FiltersPopupMenu from "./filters/FiltersPopupMenu.svelte";
  import SimpleFilters from "./filters/SimpleFilters.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const { onClose }: { onClose: () => void } = $props();

  const { user } = useUser();
  const { filters, hasAnyAdvancedFilter } = useFilter();
  const { activeMode, setActiveMode } = useStoredFilters();

  const toggleTypeFilters = $derived(
    filters.filter((filter) => filter.type === "toggle"),
  );

  const { confirm } = useConfirm();

  const onChange = (to: string) => {
    const from = $activeMode;
    setActiveMode(to);

    if (!$user.isVip || to !== FilterMode.Simple || !$hasAnyAdvancedFilter) {
      return;
    }

    confirm({
      type: ConfirmationType.SimpleFilters,
      onConfirm: () => {
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(page.url.pathname, { replaceState: true });
      },
      onCancel: () => setActiveMode(from),
    })();
  };

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isSmallTablet = useMedia(WellKnownMediaQuery.tabletSmall);

  const tabPosition = $derived($isMobile || $isSmallTablet ? "bottom" : "top");
</script>

{#snippet commonFilters()}
  <FilterGroup>
    {#each toggleTypeFilters as filter (filter.key)}
      <ToggleFilter {filter} />
    {/each}
  </FilterGroup>
{/snippet}

{#snippet badge()}
  {#if $activeMode === FilterMode.Simple}
    <FiltersPopupMenu {onClose} />
  {/if}
{/snippet}

{#snippet simpleFilters()}
  <div class="trakt-filters-content">
    <SimpleFilters />
    {@render commonFilters()}
  </div>
{/snippet}

{#snippet advancedFilters()}
  <div class="trakt-filters-content">
    <AdvancedFilters />
    {@render commonFilters()}
  </div>
{/snippet}

<Drawer
  {onClose}
  {badge}
  title={m.header_filters()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <TabView
    {tabPosition}
    value={$activeMode}
    tabs={[
      {
        value: FilterMode.Simple,
        label: m.tab_text_simple_filters(),
        content: simpleFilters,
      },
      {
        value: FilterMode.Advanced,
        label: m.tab_text_advanced_filters(),
        content: advancedFilters,
      },
    ]}
    {onChange}
  />
</Drawer>

<style>
  .trakt-filters-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
