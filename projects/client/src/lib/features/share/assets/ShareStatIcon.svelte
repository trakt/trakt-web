<script lang="ts">
  const { kind }: { kind: "plays" | "hours" | "episodes" | "movies" } =
    $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
>
  {#if kind === "plays"}
    <path d="M7 4.5v15l12-7.5z" />
  {:else if kind === "hours"}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  {:else if kind === "episodes"}
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M8 3l4 3 4-3" />
  {:else}
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  {/if}
</svg>
