<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ResetAllButton from "./_internal/ResetAllButton.svelte";
  import SaveFiltersButton from "./_internal/SaveFiltersButton.svelte";
  import Sidebar from "./_internal/Sidebar.svelte";
  import ListFilter from "./filters/ListFilter.svelte";
  import RatingsFilter from "./filters/RatingsFilter.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const { onClose }: { onClose: () => void } = $props();
  const { filters } = useFilter();
</script>

<Sidebar {onClose} title={m.header_filters()}>
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
</Sidebar>

<style>
  .trakt-filter-actions {
    display: flex;
    gap: var(--gap-xs);

    :global(.trakt-button) {
      flex: 1;
    }
  }
</style>
