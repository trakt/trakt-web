<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CalendarView } from "../models/CalendarView.ts";

  const {
    view,
    onToggle,
  }: {
    view: CalendarView;
    onToggle: () => void;
  } = $props();

  const select = (target: CalendarView) => {
    if (target !== view) onToggle();
  };
</script>

<div
  class="trakt-calendar-view-selector"
  role="group"
  aria-label={m.button_label_calendar_view()}
>
  <button
    type="button"
    class="segment"
    class:is-active={view === "day"}
    aria-pressed={view === "day"}
    onclick={() => select("day")}
  >
    {m.calendar_view_day()}
  </button>
  <button
    type="button"
    class="segment"
    class:is-active={view === "week"}
    aria-pressed={view === "week"}
    onclick={() => select("week")}
  >
    {m.calendar_view_week()}
  </button>
</div>

<style lang="scss">
  .trakt-calendar-view-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ni-2);

    height: var(--ni-40);
    padding: var(--ni-4);

    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background-color: var(--shade-900);
  }

  .segment {
    all: unset;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-32);
    padding: 0 var(--ni-12);

    border-radius: var(--border-radius-s);

    color: var(--shade-10);
    opacity: 0.45;

    font-size: var(--font-size-text);
    font-weight: 600;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, opacity;

    -webkit-tap-highlight-color: transparent;

    &.is-active {
      background-color: var(--purple-700);
      opacity: 1;
    }

    &:hover:not(.is-active) {
      background-color: color-mix(
        in srgb,
        var(--purple-700) 35%,
        transparent
      );
      opacity: 1;
    }

    &:focus-visible {
      outline: var(--border-thickness-xxs) solid var(--purple-400);
      opacity: 1;
    }
  }
</style>
