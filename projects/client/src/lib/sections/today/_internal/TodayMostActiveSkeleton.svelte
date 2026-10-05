<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const ROWS = 5;
</script>

<div class="trakt-today-most-active-skeleton" aria-hidden="true">
  {#each Array.from({ length: ROWS }, (_, index) => index) as row (row)}
    <div class="most-active-skeleton-row">
      <Skeleton width="var(--ni-32)" height="var(--ni-32)" radius="50%" />
      <div class="most-active-skeleton-text">
        <Skeleton width="70%" height="var(--ni-14)" />
        <Skeleton height="var(--ni-4)" radius="var(--border-radius-xxl)" />
      </div>
    </div>
  {/each}
</div>

<style>
  .trakt-today-most-active-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--gap-m);
    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .most-active-skeleton-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding-block: var(--gap-xs);
    padding-inline-start: calc(var(--ni-12) + var(--gap-s));
  }

  .most-active-skeleton-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    flex-grow: 1;
  }
</style>
