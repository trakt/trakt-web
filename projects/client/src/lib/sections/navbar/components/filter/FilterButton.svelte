<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";
  import FilterSidebar from "./FilterSidebar.svelte";

  // TODO add support for multiple filters
  const { currentValue } = useFilter();

  const isFiltering = $derived(Boolean($currentValue));

  const color = $derived(isFiltering ? "blue" : "default");
  const state = $derived(isFiltering ? "filtered" : "unfiltered");

  const isSidebarOpen = writable(false);
</script>

<div class="trakt-filter-button">
  <Button
    style="flat"
    size="small"
    label={m.filter_label()}
    variant="secondary"
    text="capitalize"
    {color}
    onclick={() => {
      isSidebarOpen.set(true);
    }}
  >
    {m.filter_label()}
    {#snippet icon()}
      <FilterIcon {state} />
    {/snippet}
  </Button>
</div>

<FilterSidebar isOpen={isSidebarOpen} />

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter-button {
    @include for-mobile {
      :global(.trakt-button .button-label) {
        display: none;
      }
    }
  }
</style>
