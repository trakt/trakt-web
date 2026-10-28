<script lang="ts">
  import SkeletonShimmer from "$lib/components/skeleton/SkeletonShimmer.svelte";

  /**
   * The summary header's shape while its data is in flight.
   *
   * ONE material, everywhere (design 48a). It used to mix `ArtworkPlaceholder`
   * for the band and the poster with plain grey bars for the text, so the
   * waiting state read as two unrelated loading textures stacked on each
   * other. Everything here is the same shimmer now.
   *
   * It also carries every row the masthead does - kicker, scores, title,
   * byline, a two-line deck, the action pill and the intel columns - rather
   * than the three it used to. A skeleton that is missing rows does not
   * dissolve into the header, it rearranges into it, and that jump was the
   * part that read as broken.
   *
   * It still MIRRORS the masthead's geometry rather than sharing it, which is
   * the known weakness of a skeleton that lives outside the thing it stands
   * for. Kept in one block so a drift is obvious.
   */
  const COLUMNS = ["progress", "social", "watch", "sentiment", "trivia"];

  /*
    Every width below names a step that EXISTS on the --ni-* scale. The scale
    is sparse above 320 (340, 380, 480, 520...), and a var() that resolves to
    nothing makes the whole `min()` invalid - which drops the width to auto,
    and an empty span in a centred flex column then shrinks to zero. Four rows
    silently vanished that way.
  */
</script>

<div class="trakt-summary-header-skeleton" aria-hidden="true">
  <div class="skeleton-band">
    <SkeletonShimmer radius="0" />
  </div>

  <div class="skeleton-content">
    <div class="skeleton-poster">
      <SkeletonShimmer radius="var(--border-radius-xl)" />
    </div>

    <span class="skeleton-line is-kicker"><SkeletonShimmer /></span>
    <span class="skeleton-line is-scores"><SkeletonShimmer /></span>

    <span class="skeleton-line is-title">
      <SkeletonShimmer radius="var(--border-radius-m)" />
    </span>

    <span class="skeleton-line is-byline"><SkeletonShimmer /></span>

    <!-- Two bars, because the deck clamps to two lines. One long bar read as
         a caption rather than as a paragraph waiting to arrive. -->
    <span class="skeleton-line is-deck"><SkeletonShimmer /></span>
    <span class="skeleton-line is-deck is-short"><SkeletonShimmer /></span>

    <span class="skeleton-pill">
      <SkeletonShimmer radius="var(--border-radius-xxl)" />
    </span>

    <div class="skeleton-columns">
      {#each COLUMNS as column (column)}
        <div class="skeleton-column">
          <!-- Three bars of unequal width, so a row of five columns does not
               look stamped from one template. -->
          <span class="skeleton-bar is-label"><SkeletonShimmer /></span>
          <span class="skeleton-bar is-lead"><SkeletonShimmer /></span>
          <span class="skeleton-bar is-tail"><SkeletonShimmer /></span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-header-skeleton {
    --skeleton-poster-width: clamp(
      var(--ni-132),
      min(19vw, 26vh),
      var(--ni-240)
    );
    --skeleton-poster-height: calc(var(--skeleton-poster-width) * 1.5);
    --skeleton-rhythm: var(--gap-m);
    --skeleton-poster-overhang: var(--ni-32);

    box-sizing: border-box;
    max-width: var(--list-inner-width);
    margin: calc(var(--skeleton-rhythm) + var(--skeleton-poster-overhang))
      var(--layout-distance-side) var(--skeleton-rhythm);

    border-radius: var(--border-radius-xl);
    background: var(--color-background);
  }

  /* Shorter than the poster, so the poster breaks its top edge - see the
     masthead's --masthead-poster-overhang, which this mirrors. */
  .skeleton-band {
    position: relative;
    height: calc(
      var(--skeleton-poster-height) - var(--skeleton-poster-overhang)
    );

    overflow: hidden;
    border-start-start-radius: var(--border-radius-xl);
    border-start-end-radius: var(--border-radius-xl);
  }

  .skeleton-content {
    position: relative;
    margin-top: calc(-1 * var(--skeleton-poster-height));

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    padding-bottom: var(--ni-28);
  }

  .skeleton-poster {
    position: relative;
    width: var(--skeleton-poster-width);
    height: var(--skeleton-poster-height);

    margin-bottom: var(--skeleton-rhythm);
  }

  .skeleton-line {
    position: relative;
    display: block;
    height: var(--ni-14);

    &.is-kicker {
      width: var(--ni-180);
      height: var(--ni-12);
    }

    &.is-scores {
      width: var(--ni-220);
      height: var(--ni-16);
    }

    &.is-title {
      width: min(50%, var(--ni-380));
      height: var(--ni-44);
    }

    &.is-byline {
      width: min(46%, var(--ni-340));
    }

    &.is-deck {
      width: min(62%, var(--ni-520));
      height: var(--ni-12);
    }

    /* The second line of a clamped paragraph never runs the full measure. */
    &.is-short {
      width: min(44%, var(--ni-380));
    }
  }

  .skeleton-pill {
    position: relative;
    display: block;

    width: min(52%, var(--ni-380));
    height: var(--ni-48);

    margin-top: var(--skeleton-rhythm);
  }

  .skeleton-columns {
    display: none;

    /* The intel row only exists where the masthead draws it. */
    @include for-desktop {
      display: grid;
      grid-template-columns: repeat(5, var(--ni-180));
      gap: var(--ni-24);

      margin-top: var(--ni-24);
    }
  }

  .skeleton-column {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .skeleton-bar {
    position: relative;
    display: block;

    &.is-label {
      width: calc(var(--ni-96) * var(--bar-scale, 1));
      height: var(--ni-10);
    }

    &.is-lead {
      width: calc(var(--ni-128) * var(--bar-scale, 1));
      height: var(--ni-12);
    }

    &.is-tail {
      width: calc(var(--ni-112) * var(--bar-scale, 1));
      height: var(--ni-12);
    }
  }

  /*
    Around +-12% across the row, so five columns do not read as one stencil.
    Applied as a scale on the column rather than a width on the bars, or it
    would flatten the three different bar lengths into one.
  */
  .skeleton-column:nth-child(2),
  .skeleton-column:nth-child(5) {
    --bar-scale: 0.88;
  }

  .skeleton-column:nth-child(3) {
    --bar-scale: 1.12;
  }
</style>
