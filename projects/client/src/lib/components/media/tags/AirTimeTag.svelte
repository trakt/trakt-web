<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate";
  import { toHumanTime } from "$lib/utils/formatting/date/toHumanTime.ts";

  const { airDate }: { airDate: Date } = $props();

  const time = $derived(
    isMaxDate(airDate)
      ? m.tag_text_tba()
      : toHumanTime({ date: airDate, locale: getLocale() }),
  );
</script>

<StemTag>
  <p class="bold no-wrap">
    {time}
  </p>
</StemTag>
