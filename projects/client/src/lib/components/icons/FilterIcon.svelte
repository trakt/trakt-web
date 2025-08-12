<script lang="ts">
  const { state = "unfiltered" }: { state: "filtered" | "unfiltered" } =
    $props();
</script>

<svg
  width="25"
  height="24"
  viewBox="0 0 25 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M4.46826 6.94336V3.94336H20.4683V6.94336L14.4683 11.9434V20.9434L10.4683 17.9434V11.9434L4.46826 6.94336Z"
    stroke="currentColor"
    fill={state === "filtered" ? "currentColor" : "none"}
    stroke-width="2"
    stroke-linecap="square"
    stroke-linejoin="round"
  />
</svg>
