<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import { type AdvancedMultiSelectFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import Filter from "./Filter.svelte";
  import { useFilterSetter } from "./useFilterSetter";

  const resetValue = "__reset_filter__";

  const {
    filter,
    disabled = false,
  }: { filter: AdvancedMultiSelectFilter; disabled?: boolean } = $props();

  const { getFilterValue } = useFilter();
  const currentValueRaw = $derived(getFilterValue(filter.key));

  const selectedValues = $derived(
    $currentValueRaw ? $currentValueRaw.split(",") : [],
  );

  const { gotoFilteredState } = useFilterSetter();

  const onChange = (values: string[]) => {
    const hasReset = values.includes(resetValue);
    const hasValues = values.length > 0;

    const value = !hasReset && hasValues ? values.join(",") : null;

    gotoFilteredState({
      value,
      key: filter.key,
      mode: FilterMode.Advanced,
    });
  };

  // FIXME: this is a temporary solution, to be followed up by
  // making this a feature of the MultiSelect
  const optionsWithAll = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...filter.options,
  ]);
</script>

<Filter title={filter.label}>
  <MultiSelect
    options={optionsWithAll}
    value={selectedValues}
    placeholder={m.option_text_all()}
    {disabled}
    {onChange}
  />
</Filter>
