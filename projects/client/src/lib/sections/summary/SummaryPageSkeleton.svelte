<script lang="ts">
  import SkeletonShimmer from "$lib/components/skeleton/SkeletonShimmer.svelte";
  import SummaryHeaderSkeleton from "./SummaryHeaderSkeleton.svelte";

  /**
   * The summary page's shape while its data is in flight: the header's
   * silhouette, then the first couple of rails.
   *
   * The routes used to hold this space with an empty `100dvh` div, which kept
   * the scrollbar honest and nothing else - a title you had not opened before
   * was a blank screen for as long as the request took, and then the whole
   * page arrived at once.
   *
   * Two rails, not the page's full dozen: the fold is what the eye is waiting
   * on, and a skeleton that keeps going past it promises sections that may not
   * exist for this title. Everything below resolves under its own list's
   * loading state, which is why this stops where it does.
   *
   * The cards are drawn here rather than with `SkeletonList`, which cannot
   * stand on its own: it carries no layout and its cards take their size from
   * the SectionList whose empty slot it was written for. Out here it rendered
   * nothing. Everything is the same shimmer as the header above it, so the
   * page has ONE loading texture rather than two.
   */

  const RAILS = ["primary", "secondary"];
  const CARDS_PER_RAIL = 8;
</script>

<div class="trakt-summary-page-skeleton" aria-hidden="true">
  <SummaryHeaderSkeleton />

  {#each RAILS as rail (rail)}
    <section class="skeleton-rail">
      <span class="skeleton-rail-title"><SkeletonShimmer /></span>

      <div class="skeleton-rail-cards">
        {#each Array(CARDS_PER_RAIL) as _, index (`${rail}-${index}`)}
          <div class="skeleton-card">
            <SkeletonShimmer radius="var(--border-radius-m)" />
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style lang="scss">
  .trakt-summary-page-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .skeleton-rail {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

  }

  /* Clipped rather than scrollable: it is a placeholder, not a rail you can
     use, and a scrollbar on it would invite a drag that does nothing. */
  .skeleton-rail-cards {
    display: flex;
    gap: var(--list-gap);
    overflow: hidden;

    padding-inline-start: var(--layout-distance-side);
  }

  .skeleton-card {
    position: relative;
    flex: none;
    width: var(--width-portrait-card);
    height: var(--height-portrait-card-cover);
  }

  /* Stands in for the section's heading, at the width a title usually runs. */
  .skeleton-rail-title {
    position: relative;
    display: block;

    width: var(--ni-160);
    height: var(--ni-20);

    margin-inline-start: var(--layout-distance-side);
  }
</style>
