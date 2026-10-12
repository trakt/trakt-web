<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { getStartOfWeek } from "$lib/utils/date/getStartOfWeek.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { addDays } from "date-fns/addDays";

  const weekdayLabels = $derived.by(() => {
    const reference = getStartOfWeek(new Date(), getLocale());
    return Array.from({ length: 7 }, (_, i) =>
      toHumanDayOfWeek(addDays(reference, i), getLocale()),
    );
  });
</script>

<div class="calendar-weekday-row" aria-hidden="true">
  {#each weekdayLabels as label, i (i)}
    <span class="calendar-weekday-label">{label}</span>
  {/each}
</div>

<style lang="scss">
  .calendar-weekday-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--gap-micro);

    width: 100%;
  }

  .calendar-weekday-label {
    text-align: center;

    font-size: var(--ni-12);
    letter-spacing: 0.04em;
    text-transform: uppercase;

    color: var(--color-text-secondary);
  }
</style>
