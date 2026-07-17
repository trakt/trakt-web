<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="trakt-just-watch-info-skeleton">
  <Skeleton width="var(--ni-72)" height="var(--ni-10)" />
</div>

<style>
  .trakt-just-watch-info-skeleton {
    display: flex;
    align-items: center;

    font-size: var(--font-size-text);
    min-height: 1lh;
  }
</style>
