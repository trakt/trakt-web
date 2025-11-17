<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { StarRating } from "../models/StarRating";
  import { getStarFillPercentage } from "./getStarFillPercentage";

  const {
    star,
    rating,
    isDisabled,
    onAddRating,
    isCurrentRating,
  }: {
    star: StarRating;
    rating?: number;
    isDisabled: boolean;
    onAddRating: (rating: number, ev: MouseEvent) => void;
    isCurrentRating?: boolean;
  } = $props();

  const fillPercent = $derived(
    isCurrentRating ? 100 : getStarFillPercentage(star, rating),
  );
</script>

<div class="trakt-rate-button" class:has-disabled-button={isDisabled}>
  <ActionButton
    disabled={isDisabled}
    label={m.button_label_star_rating({ stars: star.index })}
    onclick={(ev) => onAddRating(star.value, ev)}
    style="ghost"
    variant="primary"
    size="small"
    navigationType={DpadNavigationType.Item}
  >
    <StarIcon {fillPercent} />
  </ActionButton>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rate-button {
    :global(.trakt-action-button) {
      transition: color var(--transition-increment) ease-in-out;
      border-radius: 0;
      backdrop-filter: none;
    }

    @include for-mouse() {
      &:hover {
        :global(.trakt-action-button) {
          background: transparent;
        }

        :global(.trakt-action-button:not([disabled])) {
          color: var(--orange-400);
        }

        :global(svg path) {
          fill: currentColor;
        }
      }
    }
  }
</style>
