<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import UserRating from "../UserRating.svelte";

  const {
    rating,
    isCurrentRating,
    isDisabled,
    onAddRating,
  }: {
    rating: SimpleRating;
    isCurrentRating: boolean;
    isDisabled: boolean;
    onAddRating: (rating: SimpleRating) => void;
  } = $props();

  const label = $derived.by(() => {
    switch (rating) {
      case SimpleRating.Bad:
        return m.button_label_rating_bad();
      case SimpleRating.Good:
        return m.button_label_rating_good();
      case SimpleRating.Great:
        return m.button_label_rating_great();
    }
  });
</script>

<trakt-rate-button class:is-current-rating={isCurrentRating}>
  <ActionButton
    disabled={isDisabled}
    {label}
    onclick={() => onAddRating(rating)}
    style="flat"
    variant="primary"
    navigationType={DpadNavigationType.Item}
  >
    <UserRating {rating} {isCurrentRating} />
  </ActionButton>
</trakt-rate-button>

<style>
  trakt-rate-button {
    --rating-active-color: var(--shade-400);

    :global(.trakt-action-button) {
      &:hover,
      &:focus-visible {
        background-color: var(--rating-active-color);
      }
    }

    &.is-current-rating {
      :global(.trakt-action-button) {
        background-color: var(--rating-active-color);
        cursor: default;
        pointer-events: none;
      }
    }
  }
</style>
