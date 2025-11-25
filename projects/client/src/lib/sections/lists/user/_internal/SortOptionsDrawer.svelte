<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import type { SortBy, Sorting } from "../models/Sorting";

  const {
    options,
    onClose,
    onSort,
  }: {
    options: Sorting[];
    onClose: () => void;
    onSort: (sortBy: SortBy) => void;
  } = $props();

  const commonProps = $derived({
    style: "flat" as const,
    color: "default" as const,
  });
</script>

<Drawer {onClose}>
  <div class="sort-buttons">
    {#each options as option}
      <DropdownItem
        onclick={() => onSort(option.sortBy)}
        label="TODO"
        {...commonProps}
      >
        {option.sortBy.label}
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
