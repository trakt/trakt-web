<script lang="ts">
  const { size = "large" }: { size?: "small" | "large" } = $props();
</script>

{#if size === "large"}
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 4H4V20H20V16H22V22H2V2H8V4ZM22 13H20V5.41406L10.707 14.707L9.29297 13.293L18.5859 4H11V2H22V13Z"
      fill="currentColor"
    />
  </svg>
{/if}

{#if size === "small"}
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 15H13V4.41406L2.70703 14.707L1.29297 13.293L11.5859 3H1V1H15V15Z"
      fill="currentColor"
    />
  </svg>
{/if}
