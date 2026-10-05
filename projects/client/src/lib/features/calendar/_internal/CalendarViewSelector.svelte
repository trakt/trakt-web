<script lang="ts">
  import BulletListIcon from "$lib/components/icons/BulletListIcon.svelte";
  import CalendarGridIcon from "$lib/components/icons/CalendarGridIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CalendarView } from "../models/CalendarView.ts";

  const {
    view,
    onToggle,
  }: {
    view: CalendarView;
    onToggle: () => void;
  } = $props();

  const options = $derived([
    { value: "day" as const, text: m.calendar_view_day() },
    { value: "week" as const, text: m.calendar_view_week() },
  ]);

  const select = (target: CalendarView) => {
    if (target !== view) onToggle();
  };
</script>

{#snippet viewIcon(option: SegmentedSelectOption<CalendarView>)}
  {#if option.value === "day"}
    <BulletListIcon />
  {:else}
    <CalendarGridIcon />
  {/if}
{/snippet}

<div class="trakt-calendar-view-selector">
  <SegmentedSelect
    {options}
    value={view}
    variant="compact"
    icon={viewIcon}
    ariaLabel={m.button_label_calendar_view()}
    onChange={select}
    --segmented-select-radius="var(--border-radius-m)"
  />
</div>

<style>
  .trakt-calendar-view-selector {
    flex-shrink: 0;
  }

  :global(.trakt-calendar-toolbar) .trakt-calendar-view-selector {
    --segmented-select-background: transparent;
    --segmented-select-radius: var(--border-radius-m);
  }
</style>
