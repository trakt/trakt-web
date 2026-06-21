<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import Filter from "./Filter.svelte";
  import { useFilterSetter } from "./useFilterSetter";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions";

  const resetValue = "__reset_filter__";

  const { getFilterValue, filters } = useFilter();
  const { gotoFilteredState } = useFilterSetter();

  const options = useStreamingServiceOptions();
  const currentValueRaw = $derived(getFilterValue(FilterKey.Streaming));

  const selectedValues = $derived(
    $currentValueRaw ? $currentValueRaw.split(",") : [],
  );

  const keywordOptions = $derived(
    filters
      .filter((filter) => filter.key === FilterKey.Streaming)
      .flatMap((filter) => ("options" in filter ? filter.options : []))
      .map((option) => ({ label: option.label(), value: option.value })),
  );

  const serviceOptions = $derived(
    $options.all.map((option) => ({
      label: option.name,
      value: option.source,
    })),
  );

  const optionsWithReset = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...keywordOptions,
    ...serviceOptions,
  ]);

  const onChange = (values: string[]) => {
    const hasReset = values.includes(resetValue);
    const hasValues = values.length > 0;

    const value = !hasReset && hasValues ? values.join(",") : null;

    gotoFilteredState({
      value,
      key: FilterKey.Streaming,
      mode: FilterMode.Advanced,
    });
  };
</script>

<Filter title={m.header_streaming()}>
  <MultiSelect
    options={optionsWithReset}
    value={selectedValues}
    placeholder={m.option_text_all()}
    {onChange}
  />
</Filter>
