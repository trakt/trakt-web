<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { type ToggleFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: ToggleFilter } = $props();

  const { gotoFilteredState } = useFilterSetter();
  const { getFilterValue } = useFilter();
  const currentValue = $derived(getFilterValue(filter.key));

  const isHidden = $derived($currentValue === "true");

  const handler = () => {
    gotoFilteredState({
      key: filter.key,
      value: isHidden ? "false" : "true",
      mode: FilterMode.Simple,
    });
  };
</script>

<div class="hide-toggle">
  <Filter title={filter.label()} variant="inline">
    <Switch
      label={filter.label()}
      checked={isHidden}
      indeterminate={false}
      color="purple"
      onclick={handler}
      navigationType={DpadNavigationType.Item}
    />
  </Filter>
</div>

<style lang="scss">
  .hide-toggle {
    grid-column: 1 / -1;

    :global(.trakt-filter[data-variant="inline"]) {
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: var(--gap-m);
    }

    :global(.trakt-filter span) {
      text-transform: none;
      opacity: 1;
    }

    :global(.trakt-switch) {
      --button-width: var(--ni-44);
      --button-height: var(--ni-24);
      --tick-size: var(--ni-16);
      --tick-offset: var(--ni-4);

      box-shadow: none;
      border-radius: var(--border-radius-xxl);
      background-color: var(--shade-800);
    }

    :global(.trakt-switch:has(input:checked:not(:indeterminate))) {
      background-color: var(--purple-700);
    }

    :global(.trakt-switch .trakt-switch-tick) {
      background: var(--shade-10);
      box-shadow: none;
    }

    :global(.trakt-switch .trakt-switch-tick::before) {
      display: none;
    }

    :global(.trakt-switch .trakt-switch-tick svg) {
      display: none;
    }
  }
</style>
