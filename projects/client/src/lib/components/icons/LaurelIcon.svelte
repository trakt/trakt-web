<script lang="ts" module>
  const STEM_PATH = "M11 21.4C6.6 20.4 3.8 16.8 3.8 12.4c0-3.2 1.2-6 3.2-8.2";
  const LEAVES_PATH =
    "M7.60 20.30Q5.54 17.32 2.22 18.76Q4.27 21.74 7.60 20.30ZM5.20 17.80Q3.77 14.32 0.08 15.08Q1.51 18.56 5.20 17.80ZM3.90 14.40Q3.61 10.65 -0.13 10.23Q0.16 13.98 3.90 14.40ZM3.80 10.60Q4.59 7.21 1.43 5.75Q0.64 9.14 3.80 10.60ZM5.20 6.90Q6.85 4.25 4.53 2.15Q2.89 4.80 5.20 6.90ZM7.60 20.30Q10.14 18.88 9.10 16.17Q6.57 17.58 7.60 20.30ZM5.20 17.80Q8.03 17.14 7.79 14.24Q4.96 14.90 5.20 17.80ZM3.90 14.40Q6.52 14.51 7.05 11.94Q4.43 11.83 3.90 14.40ZM3.80 10.60Q6.03 11.32 7.14 9.25Q4.91 8.53 3.80 10.60Z";
</script>

{#snippet branch()}
  <path
    d={STEM_PATH}
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
  />
  <path d={LEAVES_PATH} fill="currentColor" />
{/snippet}

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  {@render branch()}
  <g transform="matrix(-1 0 0 1 24 0)">
    {@render branch()}
  </g>
</svg>
