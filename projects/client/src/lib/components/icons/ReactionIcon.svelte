<script lang="ts">
  const { state }: { state: "default" | "edit" | "add" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M20 12.5C20 17.1944 16.1944 21 11.5 21C6.80558 21 3 17.1944 3 12.5C3 7.80558 6.80558 4 11.5 4"
    stroke="currentColor"
    stroke-width="2"
  />
  <path
    d="M15.416 14C14.7428 15.7659 13.2052 17 11.416 17C9.62692 17 8.08931 15.7659 7.41605 14"
    stroke="currentColor"
    stroke-width="2"
  />

  <circle
    cx="8.5"
    cy="10.5"
    r="0.5"
    fill="currentColor"
    stroke="currentColor"
    stroke-width="2"
  />

  {#if state === "default"}
    <circle
      cx="14.5"
      cy="10.5"
      r="0.5"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
    />
    <circle cx="20" cy="4" r="3" stroke="currentColor" stroke-width="2" />
  {/if}

  {#if state === "edit"}
    <path
      d="M19 2L14 7L14 9.99997L17 9.99997L22 5.00002"
      stroke="currentColor"
      stroke-width="2"
    />
  {/if}

  {#if state === "add"}
    <path
      d="M20 -7.77091e-08L20 4M20 8L20 4M20 4L16 4M20 4L24 4"
      stroke="currentColor"
      stroke-width="2"
    />

    <circle
      cx="14.5"
      cy="10.5"
      r="0.5"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
    />
  {/if}
</svg>
