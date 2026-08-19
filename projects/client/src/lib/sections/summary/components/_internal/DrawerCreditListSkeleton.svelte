<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const skeletonCount = 3;
</script>

<div class="trakt-drawer-credit-list-skeleton" aria-hidden="true">
  {#each Array(skeletonCount) as _, index (`credit-member-skeleton-${index}`)}
    <div class="credit-skeleton-card">
      <Skeleton
        width="var(--width-summary-card-cover-compact)"
        height="var(--height-summary-card-cover-compact)"
        radius="var(--border-radius-m)"
      />

      <div class="credit-skeleton-lines">
        <Skeleton width="40%" height="var(--ni-16)" />
        <Skeleton width="70%" height="var(--ni-14)" />
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-drawer-credit-list-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .credit-skeleton-card {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    min-height: var(--height-summary-card-compact);
    padding-block: var(--ni-4);
    padding-inline: var(--ni-4) var(--ni-12);
    box-sizing: border-box;

    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
  }

  .credit-skeleton-lines {
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
