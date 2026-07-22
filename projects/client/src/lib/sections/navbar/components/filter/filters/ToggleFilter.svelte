<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import { type ToggleFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { m } from "$lib/features/i18n/messages.ts";
  import Filter from "./_internal/Filter.svelte";
  import {
    toggleFilterState,
    type ToggleFilterState,
  } from "./_internal/toggleFilterState.ts";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: ToggleFilter } = $props();

  const { gotoFilteredState } = useFilterSetter();
  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));
  const isInverted = $derived(filter.isInverted ?? false);

  const options: SegmentedSelectOption<ToggleFilterState>[] = [
    { value: "default", label: m.filter_toggle_state_default() },
    { value: "on", label: m.filter_toggle_state_on() },
    { value: "off", label: m.filter_toggle_state_off() },
  ];

  const state = $derived(
    toggleFilterState.fromValue({ value: $currentValue, isInverted }),
  );

  const handleChange = (state: ToggleFilterState) => {
    gotoFilteredState({
      key: filter.key,
      value: toggleFilterState.toValue({ state, isInverted }),
      mode: FilterMode.Simple,
    });
  };
</script>

<Filter title={filter.label()} variant="inline">
  <SegmentedSelect
    {options}
    value={state}
    ariaLabel={filter.label()}
    onChange={handleChange}
    --segmented-select-radius="var(--border-radius-m)"
  />
</Filter>
