<script>
  import ActiveContent from "./_internal/ActiveContent.svelte";
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <ActiveContent>
    <path
      d="M3 10V22H21V10M3 10V5H7M3 10H21M21 10V5H17M7 5V2M7 5H17M17 5V2"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round"
    />

    {#snippet active()}
      <path
        d="M7 2V5H17V2H19V5H22V10H2V5H5V2H7ZM2 11H22V23H2V11Z"
        fill="currentColor"
      />
    {/snippet}
  </ActiveContent>
</svg>
