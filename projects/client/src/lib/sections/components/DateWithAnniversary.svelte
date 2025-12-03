<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { getYearsDifference } from "$lib/utils/date/getYearsDifference";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";

  const { date, referenceDate }: { date: Date; referenceDate: Date } = $props();
</script>

<p class="no-wrap ellipsis">
  {toHumanDay(date, getLocale(), "short")}
  ({getYearsDifference(date, referenceDate)})
</p>
