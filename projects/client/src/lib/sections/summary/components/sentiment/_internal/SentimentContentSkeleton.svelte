<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const ANALYSIS_LINE_WIDTHS = ["100%", "96%", "100%", "88%", "52%"];
  const HIGHLIGHT_LINE_WIDTHS = ["100%", "72%"];
  const ASPECT_ROW_COUNT = 4;
</script>

<div class="trakt-sentiment-content-skeleton" aria-hidden="true">
  <div class="skeleton-lines">
    {#each ANALYSIS_LINE_WIDTHS as width, index (index)}
      <Skeleton {width} height="var(--ni-14)" />
    {/each}
  </div>

  <InfoCard variant="highlight">
    <Skeleton width="40%" height="var(--ni-18)" />
    <div class="skeleton-lines">
      {#each HIGHLIGHT_LINE_WIDTHS as width (width)}
        <Skeleton {width} height="var(--ni-14)" />
      {/each}
    </div>
  </InfoCard>

  <InfoCard>
    <Skeleton width="40%" height="var(--ni-18)" />
    <div class="skeleton-lines">
      {#each { length: ASPECT_ROW_COUNT }, index (index)}
        <Skeleton width="70%" height="var(--ni-14)" />
      {/each}
    </div>
  </InfoCard>
</div>

<style>
  .trakt-sentiment-content-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    .skeleton-lines {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }
  }
</style>
