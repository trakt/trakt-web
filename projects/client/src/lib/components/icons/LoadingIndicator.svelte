<script lang="ts">
  import { fade } from "svelte/transition";
  import LoaderIcon from "./LoaderIcon.svelte";

  const { size = "inline" }: { size?: "inline" | "small" | "large" } =
    $props();
</script>

<!-- FIXME: Add a proper crossfade component -->
<div
  class="loading-indicator"
  data-size={size}
  in:fade={{ duration: 150 }}
>
  <LoaderIcon />
</div>

<style>
  .loading-indicator {
    overflow: hidden;

    display: flex;
    justify-content: center;

    &[data-size="small"] :global(svg) {
      width: var(--ni-32);
      height: var(--ni-32);
    }

    &[data-size="large"] :global(svg) {
      width: var(--ni-56);
      height: var(--ni-56);
    }
  }
</style>
