<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import { type AdvancedMultiSelectFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import Filter from "./Filter.svelte";
  import { useFilterSetter } from "./useFilterSetter";

  const resetValue = "__reset_filter__";

  const {
    filter,
    disabled = false,
    searchPlaceholder,
    emptyLabel,
    optionLeading,
    hasOptionLeading,
  }: {
    filter: AdvancedMultiSelectFilter;
    disabled?: boolean;
    searchPlaceholder?: string;
    emptyLabel?: string;
    optionLeading?: Snippet<[SelectOption]>;
    hasOptionLeading?: (option: SelectOption) => boolean;
  } = $props();

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

  const advancedOptions = $derived(
    (filter.advanced.options ?? filter.options).map((option) => ({
      label: option.label(),
      value: option.value,
    })),
  );

  // FIXME: this is a temporary solution, to be followed up by
  // making this a feature of the MultiSelect
  const optionsWithAll = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...advancedOptions,
  ]);
</script>

<Filter title={filter.advanced.label?.() ?? filter.label()}>
  <MultiSelect
    options={optionsWithAll}
    value={selectedValues}
    placeholder={m.option_text_all()}
    {disabled}
    {searchPlaceholder}
    {emptyLabel}
    {optionLeading}
    {hasOptionLeading}
    {onChange}
  />
</Filter>
