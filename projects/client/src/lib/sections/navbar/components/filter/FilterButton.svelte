<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { writable } from "svelte/store";
  import FilterSidebar from "./FilterSidebar.svelte";

  const { size }: { size: "small" | "normal" } = $props();
  const { hasActiveFilter } = useFilter();

  const color = $derived($hasActiveFilter ? "blue" : "default");
  const state = $derived($hasActiveFilter ? "filtered" : "unfiltered");

  const isSidebarOpen = writable(false);
</script>

<div class="trakt-filter-button">
  <Button
    style="flat"
    label={m.button_label_filters()}
    variant="secondary"
    text="capitalize"
    {color}
    {size}
    navigationType={DpadNavigationType.Item}
    onclick={() => {
      isSidebarOpen.set(true);
    }}
  >
    {m.button_text_filters()}
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
