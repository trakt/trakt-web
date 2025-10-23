<script lang="ts">
  type FavoriteIconProps = {
    state?: "filled" | "open";
  };

  const { state = "open" }: FavoriteIconProps = $props();
</script>

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
