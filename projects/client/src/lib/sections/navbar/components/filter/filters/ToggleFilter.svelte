<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import { type ToggleFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { m } from "$lib/features/i18n/messages.ts";
  import Filter from "./_internal/Filter.svelte";
  import { toggleFilterState } from "./_internal/toggleFilterState.ts";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: ToggleFilter } = $props();

  const { gotoFilteredState } = useFilterSetter();
  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));
  const isInverted = $derived(filter.isInverted ?? false);

  const options: SelectOption[] = [
    { value: "default", label: m.filter_toggle_state_default() },
    { value: "on", label: m.filter_toggle_state_on() },
    { value: "off", label: m.filter_toggle_state_off() },
  ];

  const state = $derived(
    toggleFilterState.fromValue({ value: $currentValue, isInverted }),
  );

  const handleChange = (nextState: string) => {
    gotoFilteredState({
      key: filter.key,
      value: toggleFilterState.toValue({ state: nextState, isInverted }),
      mode: FilterMode.Simple,
    });
  };
</script>

<Filter title={filter.label()} variant="inline">
  <!-- Drawer controls standardise on --border-radius-m (matches the select
       dropdowns above). -->
  <SegmentedSelect
    {options}
    value={state}
    ariaLabel={filter.label()}
    onChange={handleChange}
    --segmented-select-radius="var(--border-radius-m)"
  />
</Filter>
