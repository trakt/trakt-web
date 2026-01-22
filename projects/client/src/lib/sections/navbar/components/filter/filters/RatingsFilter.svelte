<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { FILTERS } from "$lib/features/filters/_internal/constants";
  import {
    FilterKey,
    type RatingsFilter,
  } from "$lib/features/filters/models/Filter";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RatingStars from "$lib/sections/summary/components/rating/_internal/RatingStars.svelte";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import Filter from "./_internal/Filter.svelte";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const { filter }: { filter: RatingsFilter } = $props();

  const { getFilterValue } = useFilter();
  const { gotoFilteredState } = useFilterSetter();

  const currentValue = $derived(getFilterValue(filter.key));

  const ratingsFilter = assertDefined(
    FILTERS.find((filter) => filter.key === FilterKey.Ratings) as RatingsFilter,
  );

  const currentRating = $derived.by(() => {
    const currentOption = ratingsFilter.options.find(
      (option) => option.value === $currentValue,
    );

    return currentOption?.rating.value ?? 0;
  });

  const handler = (rating?: number) => {
    const ratingOption = ratingsFilter.options.find(
      (option) => option.rating.value === rating,
    );

    gotoFilteredState({
      key: filter.key,
      value: ratingOption?.value ?? null,
    });
  };
</script>

<Filter title={filter.label} variant="inline">
  <div class="trakt-filter-ratings">
    <ActionButton
      color="red"
      variant="secondary"
      label={m.button_label_reset_filter()}
      onclick={() => handler()}
      style={$currentValue ? "flat" : "ghost"}
      size="small"
      navigationType={DpadNavigationType.Item}
    >
      <CloseIcon />
    </ActionButton>
    <RatingStars
      variant="full"
      rating={currentRating}
      onAddRating={handler}
      isRating={false}
      onRemoveRating={() => handler()}
    />
  </div>
</Filter>

<style>
  .trakt-filter-ratings {
    display: flex;
    gap: var(--gap-xs);
  }
</style>
