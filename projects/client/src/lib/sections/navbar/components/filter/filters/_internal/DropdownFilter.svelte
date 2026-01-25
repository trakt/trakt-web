<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import type { ListFilterProps } from "../ListFilterProps";

  const { color, value, display, filter, multiselect }: ListFilterProps =
    $props();

  const { track } = useTrack(AnalyticsEvent.Filter);

  // TODO better toggling
  const toggleValue = (current: string | Nil, value: string) => {
    const values = new Set((current ?? "").split(",").filter(Boolean));
    values.has(value) ? values.delete(value) : values.add(value);

    if (values.size === 0) return null;
    return Array.from(values).join(",");
  };

  const isOptionSelected = (optionValue: string) => {
    if (multiselect) {
      return (value ?? "").split(",").includes(optionValue);
    }
    return optionValue === value;
  };

  const getOptionHref = (optionValue: string) => {
    if (multiselect) {
      return buildParamString({
        [filter.key]: toggleValue(value, optionValue),
      });
    }
    return buildParamString({ [filter.key]: optionValue });
  };
</script>

<GlobalParameterSetter parameter={filter.key}>
  <DropdownList
    label={filter.label}
    variant="secondary"
    size="small"
    style="flat"
    {color}
  >
    {display}
    {#snippet items()}
      {#snippet checkIcon()}
        <CheckIcon />
      {/snippet}
      <DropdownItem
        color="red"
        href="?"
        onclick={() => track({ id: filter.key, action: "reset" })}
        replacestate
      >
        {m.button_label_reset_filter()}
      </DropdownItem>
      {#each filter.options as option}
        <DropdownItem
          color="blue"
          disabled={!multiselect && isOptionSelected(option.value)}
          href={getOptionHref(option.value)}
          onclick={() => track({ id: filter.key, action: "set" })}
          replacestate
          icon={multiselect && isOptionSelected(option.value)
            ? checkIcon
            : undefined}
        >
          {option.label}
        </DropdownItem>
      {/each}
    {/snippet}
  </DropdownList>
</GlobalParameterSetter>
