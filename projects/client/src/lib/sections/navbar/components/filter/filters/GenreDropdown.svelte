<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  const { filter, currentValue } = useFilter();

  const { track } = useTrack(AnalyticsEvent.Filter);

  const isFiltering = $derived(Boolean($currentValue));

  const color = $derived(isFiltering ? "blue" : "default");
  const currentLabel = $derived($currentValue ?? m.filter_all());

  const handleFilterChange = (value: string | null) => {
    if (!Boolean(value)) {
      goto("?", { keepFocus: true });
      track({ id: $filter.key, action: "reset" });
      return;
    }

    goto(`${buildParamString({ [$filter.key]: value })}`, { keepFocus: true });
    track({ id: $filter.key, action: "set" });
  };

  // TODO: extract generic components
</script>

{#snippet nativeSelect()}
  <!-- FIXME: should eventually be a feature of DropdownList -->
  <trakt-filter-native-select>
    <Button
      style="flat"
      size="small"
      label={m.genre()}
      variant="secondary"
      text="capitalize"
      {color}
    >
      {currentLabel}
    </Button>
    <select onchange={(ev) => handleFilterChange(ev.currentTarget.value)}>
      <option selected={false} value={null} aria-label={m.filter_reset()}>
        {m.filter_reset()}
      </option>
      {#each $filter.options as option}
        <option
          selected={$currentValue === option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.label}
        </option>
      {/each}
    </select>
  </trakt-filter-native-select>
{/snippet}

{#snippet dropdown()}
  <DropdownList
    label={m.genre()}
    variant="secondary"
    text="capitalize"
    size="small"
    style="flat"
    {color}
  >
    {currentLabel}
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
{/snippet}

<div class="trakt-filter">
  <span class="meta-info">{m.genre()}</span>
  <GlobalParameterSetter parameter={$filter.key}>
    <RenderFor
      audience="authenticated"
      device={["tablet-sm", "tablet-lg", "desktop"]}
    >
      {@render dropdown()}
    </RenderFor>
    <RenderFor audience="authenticated" device={["mobile"]}>
      {@render nativeSelect()}
    </RenderFor>
  </GlobalParameterSetter>
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  trakt-filter-native-select {
    display: flex;
    position: relative;

    :global(.trakt-button) {
      flex: 1;
      display: flex;

      &:global([data-alignment="centered"]) {
        justify-content: flex-start;
      }
    }

    select {
      position: absolute;
      width: 100%;
      height: 100%;

      border: none;
      background-color: transparent;
      appearance: none;

      cursor: pointer;
      opacity: 0;
    }
  }
</style>
