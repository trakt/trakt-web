<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import SaveFiltersIcon from "$lib/components/icons/SaveFiltersIcon.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import FilterTabs from "$lib/sections/navbar/components/filter/FilterTabs.svelte";
  import ActiveFilters from "$lib/sections/navbar/components/filter/filters/ActiveFilters.svelte";
  import type { Snippet } from "svelte";

  const { onClose, children }: { onClose: () => void } & {
    children: Snippet;
  } = $props();

  const { activeMode, setActiveMode, saveFilters, resetFilters } =
    useStoredFilters();
  const { hasActiveFilter } = useFilter();

  const filtersId = "calendar-sidebar-filters";

  let isFiltersOpen = $state(false);
</script>

{#snippet badge()}
  <DiscoverToggles variant="compact" />
{/snippet}

<Drawer
  {onClose}
  {badge}
  dismissal="manual"
  title={m.header_calendar()}
  trapSelector=".trakt-filter"
  size="auto"
>
  <div class="trakt-calendar-sidebar">
    {@render children()}

    <section class="sidebar-filters" class:is-open={isFiltersOpen}>
      <div class="filters-header">
        <button
          type="button"
          class="filters-toggle"
          aria-expanded={isFiltersOpen}
          aria-controls={filtersId}
          onclick={() => (isFiltersOpen = !isFiltersOpen)}
        >
          <span class="filters-title bold">{m.header_filters()}</span>
          {#if $hasActiveFilter}
            <span class="filters-active-dot" aria-hidden="true"></span>
          {/if}
          <DropdownCaretIcon open={isFiltersOpen} />
        </button>

        <div class="filters-actions">
          <Tooltip
            content={m.tooltip_reset_filters()}
            variant="compact"
            side="bottom"
          >
            <ActionButton
              label={m.button_label_reset_all_filters()}
              style="ghost"
              color="red"
              tooltip={false}
              disabled={!$hasActiveFilter}
              onclick={resetFilters}
            >
              <ResetFiltersIcon />
            </ActionButton>
          </Tooltip>
          <Tooltip
            content={m.tooltip_save_as_default()}
            variant="compact"
            side="bottom"
          >
            <ActionButton
              label={m.button_label_save_filters()}
              style="ghost"
              tooltip={false}
              onclick={saveFilters}
            >
              <SaveFiltersIcon />
            </ActionButton>
          </Tooltip>
        </div>
      </div>

      <div
        class="filters-body filters-summary"
        inert={isFiltersOpen}
        aria-hidden={isFiltersOpen}
      >
        <div class="filters-body-inner">
          <ActiveFilters />
        </div>
      </div>

      <div class="filters-body filters-full" id={filtersId} inert={!isFiltersOpen}>
        <div class="filters-body-inner">
          <FilterTabs activeMode={$activeMode} {setActiveMode} />
        </div>
      </div>
    </section>
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-sidebar {
    --sidebar-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --sidebar-reveal-duration: 420ms;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .sidebar-filters {
    display: flex;
    flex-direction: column;

    border-radius: var(--border-radius-xl);
    background-color: var(--color-filter-panel-card-background);

    transition: box-shadow var(--sidebar-reveal-duration) var(--sidebar-ease);

    &.is-open {
      box-shadow: var(--shadow-raised);
    }
  }

  .filters-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-6) var(--ni-6) var(--ni-6) var(--gap-m);
  }

  .filters-toggle {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    flex: 1;
    min-width: 0;
    height: var(--ni-40);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-m);

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    :global(.trakt-dropdown-caret) {
      margin-inline-start: auto;
      color: var(--color-text-secondary);
      transition: transform var(--sidebar-reveal-duration) var(--sidebar-ease);
    }
  }

  .filters-title {
    font-size: var(--font-size-text);
  }

  .filters-active-dot {
    width: var(--ni-6);
    height: var(--ni-6);
    border-radius: 50%;

    background-color: var(--color-calendar-item-indicator);
    box-shadow: 0 0 var(--ni-6) var(--color-calendar-item-indicator);
  }

  .filters-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    padding-inline-start: var(--gap-xs);
    border-inline-start: var(--border-thickness-xxs) solid
      var(--color-segmented-track-border);
  }

  .filters-body {
    display: grid;
    grid-template-rows: 0fr;

    transition: grid-template-rows var(--sidebar-reveal-duration)
      var(--sidebar-ease);

    &.filters-full {
      .is-open & {
        grid-template-rows: 1fr;
      }
    }

    &.filters-summary {
      .sidebar-filters:not(.is-open) & {
        grid-template-rows: 1fr;
      }
    }
  }

  .filters-body-inner {
    min-height: 0;
    overflow: hidden;

    padding-inline: var(--gap-m);

    opacity: 0;
    transform: translateY(calc(-1 * var(--ni-8)));
    filter: blur(var(--ni-4));

    transition: var(--sidebar-reveal-duration) var(--sidebar-ease);
    transition-property: opacity, transform, filter, padding;

    > :global(*) {
      flex-shrink: 0;
    }

    .is-open .filters-full &,
    .sidebar-filters:not(.is-open) .filters-summary & {
      opacity: 1;
      transform: none;
      filter: none;
    }

    .is-open .filters-full & {
      padding-bottom: var(--gap-m);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .filters-body,
    .filters-body-inner,
    .filters-toggle :global(.trakt-dropdown-caret) {
      transition: none;
    }
  }
</style>
