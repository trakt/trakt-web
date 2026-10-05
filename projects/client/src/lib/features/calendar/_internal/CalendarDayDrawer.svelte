<script lang="ts" generics="T extends { key: string }">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isToday } from "date-fns/isToday";
  import type { Snippet } from "svelte";
  import { toCalendarDayParts } from "./toCalendarDayParts.ts";

  const {
    day,
    item,
    onClose,
  }: {
    day: { date: Date; items: T[] };
    item: Snippet<[T]>;
    onClose: () => void;
  } = $props();

  const parts = $derived(toCalendarDayParts(day.date, getLocale()));
  const title = $derived(
    isToday(day.date) ? m.text_calendar_today() : parts.weekdayLong,
  );
  const metaInfo = $derived(`${parts.dayOfMonth} ${parts.monthLong}`);
</script>

<Drawer {onClose} {title} {metaInfo} size="auto">
  <div class="trakt-calendar-day-drawer">
    {#each day.items as media (media.key)}
      {@render item(media)}
    {/each}
  </div>
</Drawer>

<style>
  .trakt-calendar-day-drawer {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-m) var(--gap-s);

    padding-bottom: var(--gap-l);
  }
</style>
