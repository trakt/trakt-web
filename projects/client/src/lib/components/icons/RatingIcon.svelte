<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import StarIcon from "./StarIcon.svelte";

  type RatingIconProps = {
    style?: VotesBasedRating;
    variant?: "trakt" | "user";
  };

  const { style = "rated", variant = "trakt" }: RatingIconProps = $props();
</script>

<div class="trakt-rating-icon" data-variant={variant}>
  <StarIcon fill={style === "rated" ? "full" : "none"} />
</div>

<style>
  .trakt-rating-icon {
    display: contents;

    &[data-variant="trakt"] {
      color: var(--color-ratings-trakt);
    }
  }
</style>
