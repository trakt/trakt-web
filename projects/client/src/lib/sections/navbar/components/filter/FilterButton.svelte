<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import FilterSidebar from "./FilterSidebar.svelte";

  const { isDisabled }: { isDisabled: boolean } = $props();

  const { hasActiveFilter, activeFilterCount } = useFilter();

  const filteredState = $derived(
    $hasActiveFilter && !isDisabled ? "filtered" : "unfiltered",
  );

  const count = $derived($activeFilterCount);

  const isSidebarOpen = writable(false);
  const onClose = () => isSidebarOpen.set(false);
</script>

<div class="trakt-filter-button" class:has-filter-support={!isDisabled}>
  <div class="filter-button-wrapper">
    <ActionButton
      style="ghost"
      label={m.button_label_filters()}
      disabled={isDisabled}
      navigationType={DpadNavigationType.Item}
      onclick={() => {
        isSidebarOpen.set(true);
      }}
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      <FilterIcon state={filteredState} />
    </ActionButton>
    {#if count > 0}
      <span class="filter-count-badge tag bold">{count}</span>
    {/if}
  </div>
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
  }

  .filter-button-wrapper {
    position: relative;
    display: inline-flex;

    .filter-count-badge {
      position: absolute;
      top: 0;
      inset-inline-end: 0;

      min-width: var(--ni-16);
      height: var(--ni-16);
      padding: 0 var(--ni-4);
      box-sizing: border-box;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: var(--border-radius-l);
      background-color: var(--purple-500);
      color: var(--shade-10);

      line-height: 1;

      pointer-events: none;
    }
  }
</style>
