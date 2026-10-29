<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ActivityType } from "$lib/models/ActivityType.ts";
  import { isUnknownDate } from "$lib/utils/date/isUnknownDate.ts";
  import { toHumanCompactDate } from "$lib/utils/formatting/date/toHumanCompactDate.ts";
  import { toRelativeHumanDay } from "$lib/utils/formatting/date/toRelativeHumanDay";

  const {
    date,
    activityType,
  }: {
    date: Date;
    activityType: ActivityType;
  } = $props();

  const dateLabel = $derived.by(() => {
    if (isUnknownDate(date)) {
      return m.button_text_mark_as_watched_unknown_date();
    }

    if (activityType === "social") {
      return toRelativeHumanDay(new Date(), date, getLocale());
    }

    return toHumanCompactDate(new Date(), date, getLocale());
  });
</script>

<div class="trakt-activity-date-tag">
  <StemTag>
    <p class="bold capitalize no-wrap">{dateLabel}</p>
  </StemTag>
</div>

<style>
  .trakt-activity-date-tag {
    --color-background-stem-tag: var(--color-background-cover-tag);
    --shadow-stem-tag: var(--shadow-cover-tag);
  }
</style>
