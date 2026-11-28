<script lang="ts">
  import type { DunesdaySide } from "./DunesdaySide.ts";

  const { side }: { side: DunesdaySide } = $props();
</script>

<svg
  class="dd-side-icon"
  viewBox="0 0 24 24"
  width="20"
  height="20"
  aria-hidden="true"
>
  {#if side === "dune"}
    <circle cx="12" cy="11" r="4.2" fill="currentColor" />
    <path
      d="M2 19 C7 13 11 16 14 15 C17 14 19 15 22 17 V21 H2 Z"
      fill="currentColor"
      opacity="0.55"
    />
    <path
      d="M12 3 V4.6 M5.6 5.6 L6.7 6.7 M18.4 5.6 L17.3 6.7"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
  {:else if side === "doom"}
    <circle
      cx="12"
      cy="12"
      r="8.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-dasharray="3 1.6"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
    />
    <path
      d="M12 1.5 V5 M12 19 V22.5 M1.5 12 H5 M19 12 H22.5"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
  {:else}
    <path
      d="M14 2 L10 22"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <path
      d="M10.6 4 A8 8 0 0 0 8.6 19.4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <path
      d="M15.4 4.6 A8 8 0 0 1 13.4 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-dasharray="2.4 1.6"
    />
  {/if}
</svg>
