<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { SortDirection } from "@trakt/api";
  import { writable } from "svelte/store";
  import SortOptionsDrawer from "./_internal/SortOptionsDrawer.svelte";
  import type { Sorting } from "./models/Sorting";

  const {
    onSort,
    sortHow,
    sortBy,
  }: {
    onSort: (sorting: Sorting) => void;
    sortHow?: SortDirection;
    sortBy?: string;
  } = $props();

  // TODO intl
  // TODO: proper props
  const sortHowInitial = writable<SortDirection | undefined>(sortHow);
  const sortByInitial = writable<string | undefined>(sortBy);

  // TODO: should be defined elsewhere
  // TODO: no extra default if it matches pre-determined ones
  const defaultSort: Sorting = {
    sortBy: { value: undefined, label: `Default (${$sortByInitial})` },
    sortHow: $sortHowInitial,
  };

  const SORT_OPTIONS: Sorting[] = [
    defaultSort,
    { sortBy: { value: "added", label: "Date Added" }, sortHow: "asc" },
    { sortBy: { value: "runtime", label: "Runtime" }, sortHow: "asc" },
    { sortBy: { value: "percentage", label: "Rating" }, sortHow: "asc" },
    { sortBy: { value: "released", label: "Release Date" }, sortHow: "asc" },
  ];

  const isOpen = writable(false);
  const sorting = writable<Sorting>(defaultSort);

  // TODO unsubscribe on destroy
  sorting.subscribe(onSort);
</script>

<div class="trakt-list-sort-actions">
  <div class="trakt-list-sort-buttons">
    <Button
      style="flat"
      size="small"
      color="default"
      label="TODO"
      onclick={() => isOpen.set(true)}
    >
      {$sorting.sortBy.label}
    </Button>

    <Button
      style="flat"
      size="small"
      color="default"
      label="TODO"
      onclick={() =>
        sorting.set({
          ...$sorting,
          sortHow: $sorting.sortHow === "asc" ? "desc" : "asc",
        })}
    >
      {#if $sorting.sortHow}
        {$sorting.sortHow === "asc" ? "↑" : "↓"}
      {:else}
        ↕
      {/if}
    </Button>
  </div>
</div>

{#if $isOpen}
  <SortOptionsDrawer
    options={SORT_OPTIONS}
    onClose={() => isOpen.set(false)}
    onSort={(sortBy) => {
      sorting.set({ ...$sorting, sortBy });
      isOpen.set(false);
    }}
  />
{/if}

<style>
  .trakt-list-sort-buttons,
  .trakt-list-sort-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
  }

  .trakt-list-sort-actions {
    gap: var(--gap-m);
  }
</style>
