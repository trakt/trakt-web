<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { writable } from "svelte/store";
  import FilterSidebar from "./FilterSidebar.svelte";

  const {
    size,
    isDisabled,
  }: { size: "small" | "normal"; isDisabled: boolean } = $props();

  const { hasActiveFilter } = useFilter();

  const filteredState = $derived(
    $hasActiveFilter && !isDisabled ? "filtered" : "unfiltered",
  );

  const isSidebarOpen = writable(false);
  const onClose = () => isSidebarOpen.set(false);
</script>

<div class="trakt-filter-button" class:has-filter-support={!isDisabled}>
  <Button
    style="flat"
    label={m.button_label_filters()}
    text="capitalize"
    color="custom"
    {size}
    disabled={isDisabled}
    navigationType={DpadNavigationType.Item}
    onclick={() => {
      isSidebarOpen.set(true);
    }}
    --color-background-custom="transparent"
    --color-foreground-custom="var(--color-foreground)"
  >
    {m.button_text_filters()}
    {#snippet icon()}
      <FilterIcon state={filteredState} />
    {/snippet}
  </Button>
</div>

{#if $isSidebarOpen}
  <FilterSidebar {onClose} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter-button {
    opacity: 0.25;
    transition: opacity var(--transition-increment) ease-in-out;

    &.has-filter-support {
      opacity: 1;
    }

    :global(.trakt-button[disabled]) {
      background: transparent;
    }

    @include for-mouse {
      :global(.trakt-button) {
        &:hover,
        &:focus-visible {
          --color-background-custom: var(--color-background);
        }
      }
    }

    @include for-tablet-sm-and-below {
      :global(.trakt-button .button-label) {
        display: none;
      }

      :global(.trakt-button[data-size="small"] .button-icon svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }
  }
</style>
