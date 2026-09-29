<script lang="ts">
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { getDayKey } from "$lib/utils/date/getDayKey.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import type { TodayDayPart } from "../models/TodayDayPart.ts";
  import type { TodayFeedSection } from "../models/TodayFeedSection.ts";
  import TodayFeedEntry from "./TodayFeedEntry.svelte";

  const { sections, now }: {
    sections: ReadonlyArray<TodayFeedSection>;
    now: Date;
  } = $props();

  const toPartText = (part: TodayDayPart) => {
    switch (part) {
      case "morning":
        return m.text_today_part_morning();
      case "afternoon":
        return m.text_today_part_afternoon();
      case "evening":
        return m.text_today_part_evening();
      case "night":
        return m.text_today_part_night();
    }
  };

  const toHeading = (section: TodayFeedSection) => {
    const part = toPartText(section.part);
    if (getDayKey(section.day) === getDayKey(now)) return part;

    return m.text_today_section_day_part({
      day: toHumanDayOfWeek(section.day, getLocale()),
      part,
    });
  };
</script>

<div class="trakt-today-feed">
  {#each sections as section (section.key)}
    <section class="feed-section">
      <h3 class="feed-heading">{toHeading(section)}</h3>
      {#each section.entries as action (action.key)}
        <TodayFeedEntry {action} />
      {/each}
    </section>
  {/each}
</div>

<style>
  .trakt-today-feed {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .feed-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .feed-heading {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }
</style>
