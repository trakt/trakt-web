<script>
  import { fade } from "svelte/transition";
  import LoaderIcon from "./LoaderIcon.svelte";
</script>

<!-- FIXME: Add a proper crossfade component -->
<div class="loading-indicator" in:fade={{ duration: 150 }}>
  <LoaderIcon />
</div>

<style>
  .loading-indicator {
    overflow: hidden;

    display: flex;
    justify-content: center;

    :global(svg) {
      width: var(--ni-56);
      height: var(--ni-56);
    }
  }
</style>
