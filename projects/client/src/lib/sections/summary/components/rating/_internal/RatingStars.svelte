<script lang="ts">
  import { STAR_RATINGS } from "../constants";
  import RateActionButton from "./RateActionButton.svelte";

  const {
    rating,
    isRating,
    onAddRating,
    onRemoveRating,
    variant = "half",
  }: {
    rating?: number;
    isRating: boolean;
    onAddRating: (rating: number, ev: MouseEvent) => void;
    onRemoveRating: () => void;
    // FIXME: remove when allowing half star filtering (https://github.com/trakt/trakt-web/issues/1466)
    variant?: "full" | "half";
  } = $props();

  /*
    Stars are rendered in reverse order because we use
    flex direction row-reverse to be able to have a highlight
    with simple css sibling selectors.
  */
  const reversedStars = $derived([...STAR_RATINGS].reverse());
</script>

<div class="trakt-rating-stars" data-variant={variant}>
  {#each reversedStars as star (star.index)}
    <RateActionButton
      {rating}
      {star}
      isDisabled={isRating}
      {onAddRating}
      {onRemoveRating}
    />
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rating-stars {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    @include for-mouse() {
      :global(.trakt-rate-button) {
        --star-hover-color: var(--orange-400);
        --star-hover-width: 100%;

        &:hover,
        &:hover ~ :global(.trakt-rate-button) {
          :global(.trakt-action-button:not([disabled])) {
            color: var(--star-hover-color);

            :global(svg rect) {
              width: var(--star-hover-width);
              fill: currentColor;
            }
          }
        }
      }
    }
  }

  .trakt-rating-stars[data-variant="half"] {
    @include for-mouse() {
      :global(.trakt-rate-button.is-last-star[data-star-fill="half"]) {
        &:hover,
        &:hover ~ :global(.trakt-rate-button) {
          --star-hover-color: var(--red-400);
        }
      }

      :global(.trakt-rate-button.is-last-star[data-star-fill="full"]),
      :global(.trakt-rate-button.is-last-star[data-star-fill="half"]) {
        &:hover {
          --star-hover-width: 50%;
        }
      }
    }
  }
</style>
