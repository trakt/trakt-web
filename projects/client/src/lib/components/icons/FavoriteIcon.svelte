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
      d="M7.1991 2.5812C9.5997 2.5812 10.7997 4.4475 12 5.6917C13.2003 4.4475 14.4003 2.5812 16.8009 2.5812C18.6011 2.5812 21.6017 3.8254 21.6017 7.558C21.6017 11.9126 16.8009 17.5116 12 20C7.1991 17.5116 2.3983 11.9126 2.3983 7.558C2.3983 3.8254 5.3989 2.5812 7.1991 2.5812Z"
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
