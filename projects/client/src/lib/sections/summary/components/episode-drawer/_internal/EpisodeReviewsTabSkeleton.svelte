<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="episode-reviews-tab-skeleton">
  <div class="skeleton-title-row">
    <Skeleton width="var(--ni-96)" height="var(--ni-20)" />
    <Skeleton width="var(--ni-120)" height="var(--ni-32)" />
  </div>

  {#each { length: 3 } as _, index (index)}
    <div class="skeleton-comment">
      <div class="skeleton-comment-header">
        <Skeleton
          width="var(--ni-36)"
          height="var(--ni-36)"
          radius="50%"
        />
        <Skeleton width="var(--ni-120)" height="var(--ni-14)" />
      </div>
      <Skeleton height="var(--ni-14)" />
      <Skeleton width="70%" height="var(--ni-14)" />
    </div>
  {/each}
</div>

<style lang="scss">
  .episode-reviews-tab-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .skeleton-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    min-height: var(--ni-40);
  }

  .skeleton-comment {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--ni-16);

    background: var(--color-card-background);
    border-radius: var(--border-radius-xl);
  }

  .skeleton-comment-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    margin-bottom: var(--gap-xs);
  }
</style>
