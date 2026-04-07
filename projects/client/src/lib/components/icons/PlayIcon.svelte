<script lang="ts">
  const { size = "default" }: { size?: "default" | "small" } = $props();
</script>

{#if size === "default"}
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.0449 12.0007L5.04492 20L5.04492 4L19.0449 12.0007Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
{:else}
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.0898 8.00053L3 14L3 2L13.0898 8.00053Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
{/if}
