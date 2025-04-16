<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";

  const { filter, setFilter } = useFilter();

  const currentOption = $derived(
    $filter.options.find((option) => option.value === $filter.value),
  );
  const isFiltering = $derived(currentOption !== undefined);

  const color = $derived(isFiltering ? "blue" : "default");
  const state = $derived(isFiltering ? "filtered" : "unfiltered");
  const currentLabel = $derived(currentOption?.label ?? m.filter_label());
</script>

<trakt-filter>
  <DropdownList
    label={m.filter_label()}
    variant="secondary"
    text="capitalize"
    size="small"
    style="flat"
    {color}
  >
    {currentLabel}
    {#snippet icon()}
      <FilterIcon {state} />
    {/snippet}
    {#snippet items()}
      <DropdownItem color="red" onclick={() => setFilter(null)}>
        {m.filter_reset()}
      </DropdownItem>
      {#each $filter.options as option}
        <DropdownItem
          color="blue"
          disabled={option.value === currentOption?.value}
          onclick={() => setFilter(option.value)}
        >
          {option.label}
        </DropdownItem>
      {/each}
    {/snippet}
  </DropdownList>
</trakt-filter>

<style>
  trakt-filter {
    :global(.trakt-list) {
      min-width: var(--ni-176);
    }
  }
</style>
