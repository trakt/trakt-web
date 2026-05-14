<script lang="ts">
  import Select from "$lib/components/select/Select.svelte";
  import type { ListFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: ListFilter } = $props();

  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));

  const { gotoFilteredState } = useFilterSetter();

  const resetValue = "";
  const options = $derived([
    { label: m.option_text_all(), value: resetValue },
    ...filter.options.map((option) => ({
      label: option.label(),
      value: option.value,
    })),
  ]);

  const selectedValue = $derived($currentValue ?? resetValue);

  const handleFilterChange = (selected: string) => {
    const nextValue = selected === resetValue ? null : selected;

    gotoFilteredState({
      key: filter.key,
      value: nextValue,
      mode: FilterMode.Simple,
    });
  };
</script>

<Filter title={filter.label()}>
  <Select
    {options}
    value={selectedValue}
    placeholder={m.option_text_all()}
    onChange={handleFilterChange}
  />
</Filter>
