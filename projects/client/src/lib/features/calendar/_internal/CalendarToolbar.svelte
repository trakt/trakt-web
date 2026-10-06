<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { Snippet } from "svelte";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import type { CalendarView } from "../models/CalendarView.ts";
  import CalendarHeader from "./CalendarHeader.svelte";
  import { toCalendarDayParts } from "./toCalendarDayParts.ts";
  import { toCalendarWeekTitle } from "./toCalendarWeekTitle.ts";

  type CalendarToolbarProps = WithRequired<
    CalendarNavigationProps,
    "navigation"
  > & {
    view: CalendarView;
    onToggleView: () => void;
    actions?: Snippet;
    filters?: Snippet;
    hasControls?: boolean;
  };

  const {
    activeDate,
    filters,
    hasControls = true,
    ...headerProps
  }: CalendarToolbarProps = $props();

  const parts = $derived(toCalendarDayParts(activeDate, getLocale()));
  const weekTitle = $derived(
    toCalendarWeekTitle({
      start: activeDate,
      today: new Date(),
      locale: getLocale(),
    }),
  );
</script>

<div class="trakt-calendar-toolbar" data-view={headerProps.view}>
  <div class="toolbar-title">
    <h2 class="toolbar-month">
      {parts.monthLong}
      <span class="toolbar-year">{parts.year}</span>
    </h2>
    <span class="toolbar-week secondary ellipsis">{weekTitle}</span>
  </div>

  {#if filters}
    <div class="toolbar-filters">
      {@render filters()}
    </div>
  {/if}

  {#if hasControls}
    <CalendarHeader {...headerProps} {activeDate} variant="bar" />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s) var(--gap-m);

    min-width: 0;

    :global(.trakt-calendar-header) {
      flex-shrink: 0;
      gap: var(--gap-s);
      margin-inline-start: auto;
    }

    @include for-mobile {
      column-gap: var(--gap-s);

      .toolbar-title {
        display: none;
      }

      &[data-view="week"] .toolbar-title {
        display: flex;
        flex-basis: 100%;
      }

      &[data-view="week"] .toolbar-week {
        display: none;
      }

      .toolbar-filters {
        padding-inline-start: 0;
        border-inline-start: none;
      }
    }
  }

  .toolbar-title {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .toolbar-filters {
    display: flex;
    align-items: center;

    padding-inline-start: var(--gap-m);
    border-inline-start: var(--border-thickness-xxs) solid
      var(--color-segmented-track-border);
  }

  .toolbar-month {
    margin: 0;

    font-size: var(--ni-28);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    white-space: nowrap;

    @include for-tablet-sm-and-below {
      font-size: var(--ni-20);
    }
  }

  .toolbar-year {
    font-weight: 400;
    color: var(--color-calendar-item-indicator);
  }

  .toolbar-week {
    font-size: var(--font-size-text);
  }
</style>
