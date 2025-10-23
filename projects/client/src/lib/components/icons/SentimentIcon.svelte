<script lang="ts">
  const { sentiment }: { sentiment: "good" | "bad" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="trakt-rate-icon"
>
  {#if sentiment === "bad"}
    <path
      d="M20 14.6568L20 7.46154C20 6.10207 18.8979 5 17.5385 5L9.75555 5C8.47336 5 7.28296 5.66519 6.61097 6.75718L5.53233 8.50996C4.54795 10.1096 4.21009 12.0242 4.58751 13.8641L5.02904 16.0165C5.14647 16.589 5.6503 17 6.2347 17L11.3846 17L10.6777 18.6083C10.0284 20.0855 10.5893 21.8148 11.9821 22.6295C12.3631 22.8524 12.8423 22.8157 13.1848 22.5373L18.1814 18.4776C19.332 17.5428 20 16.1392 20 14.6568Z"
      stroke="var(--icon-color)"
      stroke-width="2"
      fill="var(--icon-fill-color)"
    />
  {/if}

  {#if sentiment === "good"}
    <path
      d="M4 9.34324V16.5385C4 17.8979 5.10207 19 6.46154 19H14.2444C15.5266 19 16.717 18.3348 17.389 17.2428L18.4677 15.49C19.4521 13.8904 19.7899 11.9758 19.4125 10.1359L18.971 7.98345C18.8535 7.41097 18.3497 7 17.7653 7H12.6154L13.3223 5.39173C13.9716 3.91455 13.4107 2.18525 12.0179 1.37047C11.6369 1.14761 11.1577 1.18435 10.8152 1.46266L5.81862 5.52237C4.66805 6.45721 4 7.86076 4 9.34324Z"
      stroke="var(--icon-color)"
      stroke-width="2"
      fill="var(--icon-fill-color)"
    />
  {/if}
</svg>

<style>
  .trakt-rate-icon {
    path {
      transition: fill var(--transition-increment) ease-in-out;
    }
  }
</style>
