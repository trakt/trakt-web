<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";

  type MALIconProps = {
    style?: VotesBasedRating;
  };

  const { style = "rated" }: MALIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 512 512"
  style:filter={`grayscale(${style === "rated" ? 0 : 1})`}
>
  <rect width="512" height="512" rx="96" fill="#2e51a2" />
  <text
    x="256"
    y="256"
    text-anchor="middle"
    dominant-baseline="central"
    font-family="Arial, Helvetica, sans-serif"
    font-size="205"
    font-weight="700"
    fill="#fff"
  >MAL</text>
</svg>
