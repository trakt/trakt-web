<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  const { filter, currentValue } = useFilter();

  const { track } = useTrack(AnalyticsEvent.Filter);

  const isFiltering = $derived($currentValue !== undefined);

  const color = $derived(isFiltering ? "blue" : "default");
  const state = $derived(isFiltering ? "filtered" : "unfiltered");
  const currentLabel = $derived($currentValue ?? m.filter_label());
</script>

<trakt-filter>
  <GlobalParameterSetter parameter={$filter.key}>
    <DropdownList
      label={m.filter_label()}
      variant="secondary"
      text="capitalize"
      size="small"
      style="flat"
      {color}
    >
      {currentLabel}
      {#snippet icon()}
        <FilterIcon {state} />
      {/snippet}
      {#snippet items()}
        <DropdownItem
          color="red"
          href="?"
          onclick={() => track({ id: $filter.key, action: "reset" })}
        >
          {m.filter_reset()}
        </DropdownItem>
        {#each $filter.options as option}
          <DropdownItem
            color="blue"
            disabled={option.value === $currentValue}
            href={`${buildParamString({ [$filter.key]: option.value })}`}
            onclick={() => track({ id: $filter.key, action: "set" })}
          >
            {option.label}
          </DropdownItem>
        {/each}
      {/snippet}
    </DropdownList>
  </GlobalParameterSetter>
</trakt-filter>

<style>
  trakt-filter {
    :global(.trakt-list) {
      min-width: var(--ni-176);
    }
  }
</style>
