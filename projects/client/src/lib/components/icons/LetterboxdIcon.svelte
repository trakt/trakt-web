<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";

  type LetterboxdIconProps = {
    style?: VotesBasedRating;
  };

  const { style = "rated" }: LetterboxdIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 500 500"
  style:filter={`grayscale(${style === "rated" ? 0 : 1})`}
>
  <circle cx="140" cy="250" r="110" fill="#ff8000" />
  <circle cx="360" cy="250" r="110" fill="#40bcf4" />
  <circle cx="250" cy="250" r="110" fill="#00e054" />
</svg>
