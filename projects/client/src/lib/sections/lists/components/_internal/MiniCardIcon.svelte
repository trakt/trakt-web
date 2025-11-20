<script lang="ts">
  const { variant }: { variant: "landscape" | "portrait" } = $props();
</script>

{#if variant === "portrait"}
  <svg
    width="45"
    height="72"
    viewBox="0 0 45 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="45" height="63" rx="5.67488" fill="currentColor" />
    <rect
      y="65.8374"
      width="22.6995"
      height="5.67488"
      rx="2.83744"
      fill="currentColor"
    />
  </svg>
{/if}

{#if variant === "landscape"}
  <svg
    width="58"
    height="46"
    viewBox="0 0 58 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="57.6355" height="37.2414" rx="5.67488" fill="currentColor" />
    <rect
      y="40.0791"
      width="22.6995"
      height="5.67488"
      rx="2.83744"
      fill="currentColor"
    />
  </svg>
{/if}
