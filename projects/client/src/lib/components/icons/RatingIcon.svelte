<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";

  type RatingIconProps = {
    style?: VotesBasedRating;
  };

  const { style = "rated" }: RatingIconProps = $props();
</script>

<svg
  height="17"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 17 17"
  style:filter={`grayscale(${style === "rated" ? 0 : 1})`}
>
  <path
    d="M8.32253 16.3798C8.51287 16.3798 8.78784 16.2529 8.97819 16.126C13.7264 13.1227 16.6451 9.61178 16.6451 6.02684C16.6451 3.04469 14.5935 0.929688 11.9603 0.929688C10.3001 0.929688 9.09451 1.83914 8.32253 3.21388C7.56113 1.84971 6.34501 0.929688 4.68474 0.929688C2.05155 0.929688 0 3.04469 0 6.02684C0 9.61178 2.91871 13.1227 7.66688 16.126C7.85723 16.2529 8.14277 16.3798 8.32253 16.3798Z"
    fill="#FF0000"
  />
</svg>
