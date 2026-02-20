<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
</script>

<div class="trakt-banner-loading-indicator">
  <LoadingIndicator />
</div>

<style>
  .trakt-banner-loading-indicator {
    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
    }
  }
</style>
