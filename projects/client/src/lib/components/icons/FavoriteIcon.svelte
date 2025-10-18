<script lang="ts">
  type FavoriteIconProps = {
    state?: "filled" | "open";
  };

  const { state = "open" }: FavoriteIconProps = $props();
</script>

<svg
  width="24"
  height="23"
  viewBox="0 0 24 23"
  fill={state === "filled" ? "var(--icon-color, currentColor)" : "none"}
  color="var(--icon-color, currentColor)"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M12 1L14.8449 8.08436L22.4616 8.60081L16.6031 13.4956L18.4656 20.8992L12 16.84L5.53436 20.8992L7.39689 13.4956L1.53838 8.60081L9.15512 8.08436L12 1Z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="bevel"
  />
</svg>
