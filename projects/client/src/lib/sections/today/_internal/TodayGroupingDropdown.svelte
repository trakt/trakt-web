<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { TodayGrouping } from "../models/TodayGrouping.ts";

  const {
    value,
    onChange,
  }: {
    value: TodayGrouping;
    onChange: (value: string) => void;
  } = $props();

  const options = [
    { value: "title", label: m.option_text_today_by_title() },
    { value: "person", label: m.option_text_today_by_person() },
    { value: "time", label: m.option_text_today_by_time() },
  ];
</script>

<SingleSelect
  {options}
  {value}
  placeholder={m.label_today_grouping()}
  autoWidth
  {onChange}
/>
