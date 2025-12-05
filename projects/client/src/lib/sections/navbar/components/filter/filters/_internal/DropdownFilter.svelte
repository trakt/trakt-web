<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import type { ListFilterProps } from "../ListFilterProps";

  const { color, value, display, filter }: ListFilterProps = $props();

  const { track } = useTrack(AnalyticsEvent.Filter);
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
          disabled={option.value === value}
          href={`${buildParamString({ [filter.key]: option.value })}`}
          onclick={() => track({ id: filter.key, action: "set" })}
          replacestate
        >
          {option.label}
        </DropdownItem>
      {/each}
    {/snippet}
  </DropdownList>
</GlobalParameterSetter>
