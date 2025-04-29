<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Writable } from "svelte/store";
  import Sidebar from "./_internal/Sidebar.svelte";
  import ListFilter from "./filters/ListFilter.svelte";
  import ToggleFilter from "./filters/ToggleFilter.svelte";

  const { isOpen }: { isOpen: Writable<boolean> } = $props();
  const { filters } = useFilter();
</script>

<Sidebar {isOpen} title={m.filters_title()}>
  {#each $filters as filter}
    {#if filter.type === "list"}
      <ListFilter {filter} />
    {/if}

    {#if filter.type === "toggle"}
      <ToggleFilter {filter} />
    {/if}
  {/each}
</Sidebar>
