<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { ListFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const resetValue = "__reset_filter__";

  const {
    filter,
    optionLeading,
    hasOptionLeading,
  }: {
    filter: ListFilter;
    optionLeading?: Snippet<[SelectOption]>;
    hasOptionLeading?: (option: SelectOption) => boolean;
  } = $props();

  const { getFilterValue } = useFilter();
  const { gotoFilteredState } = useFilterSetter();

  const currentValue = $derived(getFilterValue(filter.key));

  const options = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...filter.options.map((o) => ({ label: o.label(), value: o.value })),
  ]);

  const onChange = (value: string) => {
    gotoFilteredState({
      key: filter.key,
      value: value === resetValue ? null : value,
      mode: FilterMode.Simple,
    });
  };
</script>

<Filter title={filter.label()}>
  <SingleSelect
    {options}
    value={$currentValue ?? null}
    placeholder={m.option_text_all()}
    {optionLeading}
    {hasOptionLeading}
    {onChange}
  />
</Filter>
