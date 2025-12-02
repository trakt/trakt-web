<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { ListUrlBuilder } from "../models/ListUrlBuilder";
  import type { SortDirection } from "../models/SortDirection";
  import type { Sorting } from "../models/Sorting";

  const {
    options,
    onClose,
    current,
    urlBuilder,
  }: {
    options: Sorting[];
    onClose: () => void;
    current: { sortHow: SortDirection; sorting: Sorting };
    urlBuilder: ListUrlBuilder;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.ListSort);
</script>

<Drawer {onClose} size="auto">
  <div class="sort-buttons">
    {#each options as option}
      <DropdownItem
        style="flat"
        color="default"
        href={`${urlBuilder({ sortHow: current.sortHow, sortBy: option.value })}`}
        label={option.label()}
        disabled={option.value === current.sorting.value}
        onclick={() => {
          track({
            sortBy: option.value ?? "default",
            sortHow: current.sortHow,
          });
        }}
      >
        {option.text()}
        {#snippet icon()}
          {#if option.value === current.sorting.value}
            <CheckIcon />
          {/if}
        {/snippet}
      </DropdownItem>
    {/each}
  </div>
</Drawer>

<style>
  .sort-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
