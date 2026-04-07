<script lang="ts">
  type FavoriteIconProps = {
    state?: "filled" | "open";
    size?: "default" | "small";
  };

  const { state = "open", size = "default" }: FavoriteIconProps = $props();
</script>

{#if size === "default"}
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={state === "filled" ? "var(--icon-color, currentColor)" : "none"}
    color="var(--icon-color, currentColor)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 4C9.75 4 10.875 5.71429 12 6.85714C13.125 5.71429 14.25 4 16.5 4C18.1875 4 21 5.14286 21 8.57143C21 12.5714 16.5 17.7143 12 20C7.5 17.7143 3 12.5714 3 8.57143C3 5.14286 5.8125 4 7.5 4Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
{:else}
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={state === "filled" ? "var(--icon-color, currentColor)" : "none"}
    color="var(--icon-color, currentColor)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 2.667C6.5 2.667 7.25 3.81 8 4.571C8.75 3.81 9.5 2.667 11 2.667C12.125 2.667 14 3.429 14 5.714C14 8.381 11 11.81 8 13.333C5 11.81 2 8.381 2 5.714C2 3.429 3.875 2.667 5 2.667Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
{/if}
