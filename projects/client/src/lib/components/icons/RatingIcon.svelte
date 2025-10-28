<script lang="ts">
  import type { VotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";

  type RatingIconProps = {
    style?: VotesBasedRating;
  };

  const { style = "rated" }: RatingIconProps = $props();
</script>

<svg
  width="17"
  height="17"
  viewBox="0 0 17 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style:filter={`grayscale(${style === "rated" ? 0 : 1})`}
>
  <rect
    x="0.429688"
    y="0.5"
    width="16"
    height="16"
    rx="8"
    fill="var(--purple-500)"
  />
  <path
    d="M15.262 1.59253L12.4762 4.9124L7.97674 10.2747M7.97674 10.2747L4.39129 7.26617M7.97674 10.2747L10.5302 12.4173"
    stroke="#FEFEFE"
    stroke-width="1.33333"
  />
  <path
    d="M8.1485 6.93676L6.10571 5.22266"
    stroke="#FEFEFE"
    stroke-width="1.33333"
  />
  <path
    d="M16.0085 4.83008L11.2948 10.4477"
    stroke="#FEFEFE"
    stroke-width="1.33333"
  />
  <path
    d="M15.5133 10.397C14.4651 14.3091 10.4439 16.6307 6.53183 15.5825C2.61974 14.5343 0.298138 10.5131 1.34638 6.60103C2.39462 2.68895 6.41576 0.367345 10.3278 1.41558"
    stroke="#FEFEFE"
    stroke-width="1.33333"
  />
</svg>
