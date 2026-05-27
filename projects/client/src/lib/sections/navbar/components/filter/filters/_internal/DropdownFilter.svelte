<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListFilterProps } from "../ListFilterProps";
  import { useFilterSetter } from "./useFilterSetter";

  const resetValue = "__reset_filter__";

  const { value, filter }: ListFilterProps = $props();

  const selectedValues = $derived(value ? value.split(",") : []);

  const { gotoFilteredState } = useFilterSetter();

  const onChange = (values: string[]) => {
    const hasReset = values.includes(resetValue);
    const hasValues = values.length > 0;

    const nextValue = !hasReset && hasValues ? values.join(",") : null;

    gotoFilteredState({
      value: nextValue,
      key: filter.key,
      mode: FilterMode.Simple,
    });
  };

  const options = $derived(
    filter.options.map((option) => ({
      label: option.label(),
      value: option.value,
    })),
  );

  const optionsWithAll = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...options,
  ]);
</script>

<MultiSelect
  options={optionsWithAll}
  value={selectedValues}
  placeholder={m.option_text_all()}
  {onChange}
/>
