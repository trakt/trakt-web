<script lang="ts">
  import type { ListFilter } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DropdownFilter from "./_internal/DropdownFilter.svelte";
  import Filter from "./_internal/Filter.svelte";
  import SelectFilter from "./_internal/SelectFilter.svelte";
  import type { ListFilterProps } from "./ListFilterProps";

  const {
    filter,
    multiselect = false,
  }: { filter: ListFilter; multiselect?: boolean } = $props();

  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));

  const isFiltering = $derived(Boolean($currentValue));

  const color = $derived(isFiltering ? "blue" : "default");

  // TODO deal better with multiselect
  const currentLabel = $derived.by(() => {
    if (!$currentValue) return m.option_text_all();

    if (multiselect) {
      const selectedValues = $currentValue.split(",");
      const selectedLabels = filter.options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label);

      if (selectedLabels.length === 0) return m.option_text_all();
      return selectedLabels.join(", ");
    }

    return (
      filter.options.find((option) => option.value === $currentValue)?.label ??
      m.option_text_all()
    );
  });

  const commonProps: ListFilterProps = $derived({
    color,
    value: $currentValue,
    display: currentLabel,
    filter: filter,
    multiselect,
  });
</script>

<Filter title={filter.label}>
  <RenderFor
    audience="authenticated"
    device={["tablet-sm", "tablet-lg", "desktop"]}
  >
    <DropdownFilter {...commonProps} />
  </RenderFor>
  <RenderFor audience="authenticated" device={["mobile"]}>
    <SelectFilter {...commonProps} />
  </RenderFor>
</Filter>
