<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import type { RatingsFilter } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RateActionButton from "$lib/sections/summary/components/rating/_internal/RateActionButton.svelte";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: RatingsFilter } = $props();

  const { getFilterValue } = useFilter();
  const { gotoFilteredState } = useFilterSetter();

  const currentValue = getFilterValue(filter.key);

  const handler = (value: string | null) => {
    gotoFilteredState({
      key: filter.key,
      value,
    });
  };
</script>

<Filter title={filter.label}>
  <div class="trakt-filter-ratings">
    <ActionButton
      color="red"
      variant="secondary"
      label={m.button_label_reset_filter()}
      onclick={() => handler(null)}
      style={$currentValue ? "flat" : "ghost"}
      size="small"
      navigationType={DpadNavigationType.Item}
    >
      <CloseIcon />
    </ActionButton>
    {#each filter.options as option}
      <RateActionButton
        star={option.rating}
        isCurrentRating={$currentValue === option.value}
        isDisabled={$currentValue === option.value}
        onAddRating={() => {
          handler(option.value);
        }}
      />
    {/each}
  </div>
</Filter>

<style>
  .trakt-filter-ratings {
    display: flex;
    gap: var(--gap-xs);
  }
</style>
