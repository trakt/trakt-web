<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
</script>

<!-- Shown below the (already-painted) hero while the detail query is in flight
     so slower periods (e.g. all-time) don't look like nothing is happening. -->
<div class="trakt-yir-loading">
  <LoadingIndicator />
</div>

<style lang="scss">
  .trakt-yir-loading {
    display: flex;
    justify-content: center;
    padding: var(--ni-72) 0;
    color: var(--color-yir-text-secondary);
  }
</style>
