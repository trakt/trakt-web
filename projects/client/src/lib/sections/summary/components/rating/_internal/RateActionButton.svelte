<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { StarRating } from "../models/StarRating";
  import { getStarFill } from "./getStarFill";

  const {
    star,
    rating,
    isDisabled,
    onAddRating,
    onRemoveRating,
    isCurrentRating,
  }: {
    star: StarRating;
    rating?: number;
    isDisabled: boolean;
    onAddRating: (rating: number, ev: MouseEvent) => void;
    onRemoveRating: () => void;
    isCurrentRating?: boolean;
  } = $props();

  const starFill = $derived(
    isCurrentRating ? "full" : getStarFill(star, rating),
  );

  const handleRating = (ev: MouseEvent) => {
    if (starFill === "half") {
      onRemoveRating();
      return;
    }

    const value =
      star.value === rating
        ? (star.range.max + star.range.min) / 2
        : star.value;
    onAddRating(value, ev);
  };

  const isLastStar = $derived(
    rating && rating > star.range.min && rating <= star.value,
  );
</script>

<div
  class="trakt-rate-button"
  class:has-disabled-button={isDisabled}
  class:is-last-star={isLastStar}
  data-star-fill={starFill}
>
  <ActionButton
    disabled={isDisabled}
    label={m.button_label_star_rating({ stars: star.index })}
    onclick={handleRating}
    style="ghost"
    variant="primary"
    size="small"
    navigationType={DpadNavigationType.Item}
  >
    <StarIcon fill={starFill} />
  </ActionButton>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rate-button {
    :global(.trakt-action-button) {
      transition: color var(--transition-increment) ease-in-out;
      border-radius: 0;
    }

    @include for-mouse() {
      &:hover {
        :global(.trakt-action-button) {
          background: transparent;
        }
      }
    }
  }
</style>
