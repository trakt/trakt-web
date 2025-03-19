<script lang="ts">
  const { style = "open" }: { style?: "filled" | "open" } = $props();
</script>

<svg
  width="24"
  height="25"
  viewBox="0 0 24 25"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M20 11.6895C20 8.24501 18 4.68945 12 4.68945C6 4.68945 4 8.68945 4 11.6895C4 13.1339 4.77778 14.8006 5.77778 15.8006C5.77778 16.6895 4.83333 19.8561 4.5 20.6895C5.33333 20.3561 7.8 18.9895 9 18.1895C13.6218 20.5004 20 17.1339 20 11.6895Z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="round"
    fill={style === "filled" ? "currentColor" : "none"}
  />
</svg>
