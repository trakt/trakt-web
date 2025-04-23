<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
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
</script>

<trakt-rate-button class:is-current-rating={isCurrentRating}>
  <ActionButton
    disabled={isDisabled}
    label={toTranslatedValue("rating", rating)}
    onclick={() => onAddRating(rating)}
    style="flat"
    variant="primary"
  >
    <UserRating {rating} {isCurrentRating} />
  </ActionButton>
</trakt-rate-button>

<style>
  trakt-rate-button {
    --rating-active-color: var(--shade-400);

    :global(.trakt-action-button) {
      &:hover {
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
