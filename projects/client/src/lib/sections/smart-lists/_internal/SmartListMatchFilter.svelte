<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Filter from "$lib/sections/navbar/components/filter/filters/Filter.svelte";

  type SmartListMatchFilterProps = {
    value: "and" | "or" | undefined;
    disabled?: boolean;
    onChange: (value: "and" | null) => void;
  };

  const { value, disabled = false, onChange }: SmartListMatchFilterProps =
    $props();

  const options = [
    { value: "or", text: m.option_text_match_any() },
    { value: "and", text: m.option_text_match_all() },
  ];
</script>

<Filter title={m.label_smart_list_match()} variant="inline">
  <SegmentedSelect
    value={value ?? "or"}
    {options}
    ariaLabel={m.label_smart_list_match()}
    {disabled}
    onChange={(next) => onChange(next === "and" ? "and" : null)}
    --segmented-select-radius="var(--border-radius-m)"
  />
</Filter>
