<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="trakt-month-review-stat-skeleton" aria-hidden="true">
  <Skeleton width="var(--ni-64)" height="var(--ni-36)" />
  <Skeleton width="var(--ni-48)" height="var(--ni-12)" />
</div>

<style>
  .trakt-month-review-stat-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
