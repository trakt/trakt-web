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
    <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="2" />
    <path d="M17 20L19 22" stroke="currentColor" stroke-width="2" />
    <path d="M7 20L5 22" stroke="currentColor" stroke-width="2" />
    <path d="M9 2H15" stroke="currentColor" stroke-width="2" />
    <path d="M12 7V13L15 15" stroke="currentColor" stroke-width="2" />

    {#snippet active()}
      <circle cx="12" cy="13" r="9" fill="currentColor" />
      <path d="M17 20L19 22" stroke="currentColor" stroke-width="2" />
      <path d="M7 20L5 22" stroke="currentColor" stroke-width="2" />
      <path d="M9 2H15" stroke="currentColor" stroke-width="2" />
      <path
        d="M12 7V13L15 15"
        stroke="var(--color-background-side-navbar)"
        stroke-width="2"
      />
    {/snippet}
  </ActiveContent>
</svg>
