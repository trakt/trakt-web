<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { ToggleFilter } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: ToggleFilter } = $props();

  const { gotoFilteredState } = useFilterSetter();
  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));

  const handler = () => {
    const toggledValue = $currentValue === "true" ? "false" : "true";

    gotoFilteredState({
      key: filter.key,
      value: toggledValue === filter.defaultValue ? null : toggledValue,
    });
  };
</script>

<Filter title={filter.label}>
  <Switch
    label={filter.label}
    checked={$currentValue === "true"}
    color="blue"
    onclick={handler}
    navigationType={DpadNavigationType.Item}
  />
</Filter>
