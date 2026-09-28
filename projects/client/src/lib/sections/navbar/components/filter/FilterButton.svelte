<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CountBadge from "$lib/components/badge/CountBadge.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { ListTarget } from "$lib/sections/smart-lists/models/ListTarget";
  import { useFilterSidebar } from "$lib/stores/useFilterSidebar.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import FilterSidebarClose from "./_internal/FilterSidebarClose.svelte";
  import FilterSidebar from "./FilterSidebar.svelte";

  const {
    isDisabled,
    smartListTarget,
    docked = false,
  }: {
    isDisabled: boolean;
    smartListTarget?: ListTarget | Nil;
    docked?: boolean;
  } = $props();

  const { hasActiveFilter, activeFilterCount } = useFilter();

  const filteredState = $derived(
    $hasActiveFilter && !isDisabled ? "filtered" : "unfiltered",
  );

  const count = $derived($activeFilterCount);

  const {
    isOpen: isSharedOpen,
    isDocked,
    close: closeShared,
    toggle: toggleShared,
  } = useFilterSidebar();
  const isLocalOpen = writable(false);

  const isOpen = $derived(docked ? $isSharedOpen : $isLocalOpen);
  const isReplaced = $derived(docked && $isDocked);

  const toggle = () => {
    if (docked) {
      return toggleShared();
    }

    isLocalOpen.set(!$isLocalOpen);
  };

  const close = () => {
    if (docked) {
      return closeShared();
    }

    isLocalOpen.set(false);
  };

  let buttonElement = $state<HTMLElement | undefined>();
</script>

<div class="trakt-filter-button" class:has-filter-support={!isDisabled}>
  <div class="filter-button-wrapper" bind:this={buttonElement}>
    <ActionButton
      style="ghost"
      label={isOpen ? m.button_label_close() : m.button_label_filters()}
      disabled={isDisabled}
      navigationType={DpadNavigationType.Item}
      onclick={toggle}
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      <span class="filter-button-icon" class:is-replaced={isReplaced}>
        <FilterIcon state={filteredState} />
      </span>
    </ActionButton>
    {#if count > 0}
      <span class="filter-count-anchor" class:is-replaced={isReplaced}>
        <CountBadge {count} />
      </span>
    {/if}
  </div>
</div>

{#if docked && !isDisabled}
  <FilterSidebarClose
    anchor={buttonElement}
    isVisible={$isDocked}
    onClose={close}
  />
{/if}

{#if isOpen && !isDisabled}
  <FilterSidebar onClose={close} {docked} {smartListTarget} />
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

    .filter-button-icon {
      display: flex;

      transition: calc(2 * var(--transition-increment)) ease-in-out;
      transition-property: opacity, transform;

      &.is-replaced {
        opacity: 0;
        transform: rotate(90deg) scale(0.6);
      }
    }

    .filter-count-anchor {
      position: absolute;
      top: 0;
      inset-inline-end: 0;

      display: inline-flex;
      pointer-events: none;

      transition: opacity calc(2 * var(--transition-increment)) ease-in-out;

      &.is-replaced {
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .filter-button-icon,
      .filter-count-anchor {
        transition: none;
      }
    }
  }
</style>
