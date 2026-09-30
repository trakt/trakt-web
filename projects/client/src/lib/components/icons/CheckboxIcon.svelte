<script lang="ts">
  const { state }: { state: "checked" | "unchecked" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    x="3"
    y="3"
    width="18"
    height="18"
    rx="3"
    stroke="currentColor"
    stroke-width="2"
    fill={state === "checked" ? "currentColor" : "transparent"}
  />
  {#if state === "checked"}
    <path
      d="M7.5 12.5L10.5 15.5L16.5 9"
      stroke="var(--checkbox-icon-check-color, var(--color-option-list-background))"
      stroke-width="2"
    />
  {/if}
</svg>
