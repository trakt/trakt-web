<script lang="ts">
  const { direction }: { direction: "asc" | "desc" } = $props();
</script>

<svg
  width="24"
  height="23"
  viewBox="0 0 24 23"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="trakt-sort-direction-icon"
  class:is-ascending={direction === "asc"}
>
  <path
    d="M5.70703 18.5859L8 16.293L9.41406 17.707L4.70703 22.4141L0 17.707L1.41406 16.293L3.70703 18.5859V0H5.70703V18.5859ZM16.707 20H11.707V18H16.707V20ZM17.707 14H11.707V12H17.707V14ZM20.707 8H11.707V6H20.707V8ZM23.707 2H11.707V0H23.707V2Z"
    fill="currentColor"
  />
</svg>

<style>
  .trakt-sort-direction-icon {
    transition: transform var(--transition-increment) ease-in-out;
  }

  .is-ascending {
    transform: scaleY(-1);
  }
</style>
