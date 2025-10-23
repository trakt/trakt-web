<script lang="ts">
  const {
    state,
    size = "small",
  }: { state: "added" | "missing"; size?: "small" | "normal" } = $props();
</script>

{#if size === "small"}
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1H2V15L8 11L14 15V1Z"
      class="trakt-bookmark-path"
      stroke="currentColor"
      fill={state === "added" ? "currentColor" : "transparent"}
      stroke-width="2"
      stroke-linejoin="bevel"
    />
  </svg>
{:else}
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="trakt-bookmark-path"
      fill={state === "added" ? "currentColor" : "transparent"}
      d="M20 2H4V22L12 18L20 22V2Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
{/if}

<style>
  .trakt-bookmark-path {
    transition: fill var(--transition-increment) ease-in-out;
  }
</style>
