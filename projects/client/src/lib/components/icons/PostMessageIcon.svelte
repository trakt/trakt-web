<script lang="ts">
  const { style = "open" }: { style?: "filled" | "open" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M21.5882 4.92882L9.99943 20.8564L8.28992 12.6058L1.99943 7L21.5882 4.92882Z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="bevel"
    fill={style === "filled" ? "currentColor" : "none"}
  />
</svg>
