<script lang="ts">
  import { STAR_RATINGS } from "../constants";
  import RateActionButton from "./RateActionButton.svelte";

  const {
    rating,
    isRating,
    onAddRating,
  }: {
    rating?: number;
    isRating: boolean;
    onAddRating: (rating: number) => void;
  } = $props();

  /*
    Stars are rendered in reverse order because we use
    flex direction row-reverse to be able to have a highlight
    with simple css sibling selectors.
  */
  const reversedStars = $derived([...STAR_RATINGS].reverse());
</script>

<div class="trakt-rating-stars">
  {#each reversedStars as star (star.index)}
    <RateActionButton {rating} {star} isDisabled={isRating} {onAddRating} />
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
        &:hover,
        &:hover ~ :global(.trakt-rate-button) {
          /* TODO extract css var for color */
          :global(.trakt-action-button:not([disabled])) {
            color: var(--orange-400);
          }

          :global(svg path) {
            fill: currentColor;
          }
        }
      }
    }
  }
</style>
