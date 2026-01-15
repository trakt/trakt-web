<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import StarIcon from "./StarIcon.svelte";

  type RatingIconProps = {
    style?: VotesBasedRating;
  };

  const { style = "rated" }: RatingIconProps = $props();
</script>

<StarIcon fill={style === "rated" ? "full" : "none"} />
