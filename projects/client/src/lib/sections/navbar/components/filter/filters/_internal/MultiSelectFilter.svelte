<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import type { MultiSelectSelection } from "$lib/components/select/models/MultiSelectSelection.ts";
  import { type AdvancedMultiSelectFilter } from "$lib/features/filters/models/Filter.ts";
  import { FilterMode } from "$lib/features/filters/models/FilterMode.ts";
  import { fromMultiSelectSelection } from "$lib/features/filters/fromMultiSelectSelection.ts";
  import { toMultiSelectSelection } from "$lib/features/filters/toMultiSelectSelection.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import Filter from "./Filter.svelte";
  import { useFilterSetter } from "./useFilterSetter.ts";

  const resetValue = "__reset_filter__";

  const {
    filter,
    disabled = false,
    searchPlaceholder,
    emptyLabel,
  }: {
    filter: AdvancedMultiSelectFilter;
    disabled?: boolean;
    searchPlaceholder?: string;
    emptyLabel?: string;
    } = $props();

  const { getFilterValue } = useFilter();
  const currentValueRaw = $derived(getFilterValue(filter.key));

  const selection = $derived(toMultiSelectSelection($currentValueRaw));

  const { gotoFilteredState } = useFilterSetter();

  const onChange = (next: MultiSelectSelection) => {
    const hasReset = next.included.includes(resetValue) ||
      next.excluded.includes(resetValue);

    const value = hasReset ? null : fromMultiSelectSelection(next);

    gotoFilteredState({
      value,
      key: filter.key,
      mode: FilterMode.Advanced,
    });
  };

  const hasExclusion = $derived(filter.advanced.hasExclusion ?? true);

  const advancedOptions = $derived(
    (filter.advanced.options ?? filter.options).map((option) => ({
      label: option.label(),
      value: option.value,
      icon: option.icon,
      // "My Favorites" expands to a saved set; excluding it is not meaningful.
      excludable: hasExclusion && option.value !== "favorites",
    })),
  );

  // FIXME: this is a temporary solution, to be followed up by
  // making this a feature of the MultiSelect
  const optionsWithAll = $derived([
    { label: m.button_label_reset_filter(), value: resetValue, excludable: false },
    ...advancedOptions,
  ]);
</script>

<Filter title={filter.advanced.label?.() ?? filter.label()}>
  <MultiSelect
    options={optionsWithAll}
    included={selection.included}
    excluded={selection.excluded}
    placeholder={m.option_text_all()}
    {disabled}
    {searchPlaceholder}
    {emptyLabel}
    {onChange}
  />
</Filter>
