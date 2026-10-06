<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import type { ListFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import Filter from "./Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const resetValue = "__reset_filter__";

  const {
    filter,
  }: {
    filter: ListFilter;
    } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const title = $derived(filter.label());

  const { getFilterValue } = useFilter();
  const { gotoFilteredState } = useFilterSetter();

  const currentValue = $derived(getFilterValue(filter.key));

  const options = $derived([
    { label: m.button_label_reset_filter(), value: resetValue },
    ...filter.options.map((o) => ({
      label: o.label(),
      value: o.value,
      icon: o.icon,
    })),
  ]);

  const onChange = (value: string) => {
    gotoFilteredState({
      key: filter.key,
      value: value === resetValue ? null : value,
      mode: FilterMode.Simple,
    });
  };
</script>

<Filter {title} variant={$isMobile ? "compact" : "inline"}>
  <SingleSelect
    {options}
    value={$currentValue ?? null}
    placeholder={$isMobile ? title : m.option_text_all()}
    variant="chip"
    autoWidth
    {onChange}
  />
</Filter>
