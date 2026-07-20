<script lang="ts">
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
</script>

<span class="trakt-badge-sparkle" aria-hidden="true">
  <SparkleStarIcon />
</span>

<style>
  .trakt-badge-sparkle {
    display: inline-flex;

    :global(svg) {
      width: var(--badge-sparkle-size, var(--ni-16));
      height: var(--badge-sparkle-size, var(--ni-16));
    }
  }
</style>
