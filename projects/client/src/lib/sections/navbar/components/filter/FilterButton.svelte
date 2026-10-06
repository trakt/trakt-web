<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CountBadge from "$lib/components/badge/CountBadge.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { ListTarget } from "$lib/sections/smart-lists/models/ListTarget";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import FilterSidebar from "./FilterSidebar.svelte";

  const {
    isDisabled,
    smartListTarget,
  }: {
    isDisabled: boolean;
    smartListTarget?: ListTarget | Nil;
  } = $props();

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
      <span class="filter-count-anchor">
        <CountBadge {count} />
      </span>
    {/if}
  </div>
</div>

{#if $isSidebarOpen}
  <FilterSidebar {onClose} {smartListTarget} />
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

    .filter-count-anchor {
      position: absolute;
      top: 0;
      inset-inline-end: 0;

      display: inline-flex;
      pointer-events: none;
    }
  }
</style>
