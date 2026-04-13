<script lang="ts">
  const { state = "closed" }: { state?: "closed" | "open" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d={state === "open" ? "M3 6H16" : "M3 6H21"}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
  <path
    d={state === "open" ? "M3 12H12" : "M3 12H21"}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
  <path
    d={state === "open" ? "M3 18H16" : "M3 18H21"}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
  <path
    class="caret"
    class:is-open={state === "open"}
    d="M21 7L16 12L21 17"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

<style>
  path {
    transition: d var(--transition-increment) ease-in-out;
  }

  .caret {
    opacity: 0;
    transform: translateX(4px);
    transition:
      opacity var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;
  }

  .caret.is-open {
    opacity: 1;
    transform: translateX(0);
  }
</style>
