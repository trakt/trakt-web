<script lang="ts">
  const { direction }: { direction: "up" | "down" } = $props();

  const path = $derived(
    direction === "down"
      ? "M1.5 4.5L8.5 11.5L15.5 4.5"
      : "M15.5 11.5L8.5 4.5L1.5 11.5",
  );
</script>

<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d={path} stroke="currentColor" stroke-width="2" />
</svg>
