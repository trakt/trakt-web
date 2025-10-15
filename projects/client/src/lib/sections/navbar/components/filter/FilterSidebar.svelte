<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ResetAllButton from "./_internal/ResetAllButton.svelte";
  import SaveFiltersButton from "./_internal/SaveFiltersButton.svelte";
  import ListFilter from "./filters/ListFilter.svelte";
  import RatingsFilter from "./filters/RatingsFilter.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const { onClose }: { onClose: () => void } = $props();
  const { filters } = useFilter();
</script>

<Drawer {onClose} title={m.header_filters()} trapSelector=".trakt-filter">
  {#each $filters as filter}
    {#if filter.type === "list"}
      <ListFilter {filter} />
    {/if}

    {#if filter.type === "ratings"}
      <RatingsFilter {filter} />
    {/if}

    {#if filter.type === "toggle"}
      <ToggleFilter {filter} />
    {/if}
  {/each}

  <div
    class="trakt-filter-actions"
    data-dpad-navigation={DpadNavigationType.List}
  >
    <SaveFiltersButton onSave={onClose} />
    <ResetAllButton />
  </div>
</Drawer>

<style>
  .trakt-filter-actions {
    display: flex;
    gap: var(--gap-xs);

    :global(.trakt-button) {
      flex: 1;
    }
  }
</style>
