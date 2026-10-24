<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const ROW_COUNT = 3;
  const TEXT_LINE_WIDTHS = ["100%", "92%", "64%"];
</script>

<div class="trakt-reality-check-skeleton" aria-hidden="true">
  <div class="skeleton-hero">
    <Skeleton width="var(--ni-160)" height="var(--ni-28)" />
    <Skeleton width="var(--ni-200)" height="var(--ni-14)" />
    <Skeleton height="var(--ni-6)" radius="var(--ni-3)" />
  </div>

  <InfoCard>
    <div class="skeleton-rows">
      {#each { length: ROW_COUNT }, index (index)}
        <div class="skeleton-row">
          <Skeleton width="55%" height="var(--ni-18)" />
          <Skeleton width="var(--ni-96)" height="var(--ni-14)" />
        </div>
      {/each}
    </div>
  </InfoCard>

  <div class="skeleton-text">
    {#each TEXT_LINE_WIDTHS as width (width)}
      <Skeleton {width} height="var(--ni-14)" />
    {/each}
  </div>
</div>

<style lang="scss">
  .trakt-reality-check-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .skeleton-hero {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .skeleton-rows {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
      min-height: var(--ni-32);
    }

    .skeleton-text {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }
  }
</style>
