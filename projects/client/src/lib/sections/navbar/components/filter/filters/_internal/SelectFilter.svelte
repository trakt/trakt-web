<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { ListFilterProps } from "../ListFilterProps";
  import { useFilterSetter } from "./useFilterSetter";

  const { color, value, display, filter }: ListFilterProps = $props();

  const { gotoFilteredState } = useFilterSetter();

  const handleFilterChange = (value: string | null) => {
    gotoFilteredState({
      key: filter.key,
      value,
    });
  };
</script>

<trakt-filter-native-select>
  <Button
    style="flat"
    size="small"
    label={filter.label}
    variant="secondary"
    text="capitalize"
    {color}
  >
    {display}
  </Button>
  <select
    onchange={(ev) => handleFilterChange(ev.currentTarget.value)}
    data-dpad-navigation={DpadNavigationType.Item}
    id={filter.key}
  >
    <option
      selected={false}
      value={null}
      aria-label={m.button_label_reset_filter()}
    >
      {m.button_label_reset_filter()}
    </option>
    {#each filter.options as option}
      <option
        selected={value === option.value}
        value={option.value}
        aria-label={option.label}
      >
        {option.label}
      </option>
    {/each}
  </select>
</trakt-filter-native-select>

<style>
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

    &:has(select:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--purple-500);
      outline-offset: var(--border-thickness-xs);
      border-radius: calc(var(--border-radius-m) * 0.76925);
    }
  }
</style>
