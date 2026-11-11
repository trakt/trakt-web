<script lang="ts">
  import SkeletonShimmer from "$lib/components/skeleton/SkeletonShimmer.svelte";

  /**
   * The summary header's shape while its data is in flight.
   *
   * It MIRRORS MastheadSummaryHeader rather than sharing it, so it is written
   * as a copy of that file's geometry: the same rows in the same order, the
   * same tokens for every gap, the same strip rules. When the masthead
   * changes, this changes with it - a skeleton that drifts does not dissolve
   * into the header, it rearranges into it, and that jump is what reads as
   * broken.
   *
   * Text bars are sized in `cap` units of the font they stand for, so each
   * bar covers the ink of its line - the same edges the masthead trims its
   * title and deck to.
   */
  type BulletShape = {
    /* Line widths as a share of the column, first line to last. */
    lines: ReadonlyArray<number>;
    /* Gains a line once the column narrows to 220px (medium) or 180px. */
    wrapsAt?: "medium" | "narrow";
  };

  type ColumnShape = {
    key: string;
    subline: "pill" | "text";
    isStretch?: boolean;
  } & (
    | { body: "bullets"; bullets: ReadonlyArray<BulletShape> }
    | { body: "up-next" }
    | { body: "people" }
  );

  /*
    What a signed-in viewer gets on a show they have started, in the
    masthead's order. Bullet widths are the typical line lengths of each
    column's copy.
  */
  const COLUMNS: ReadonlyArray<ColumnShape> = [
    {
      key: "insights",
      subline: "pill",
      body: "bullets",
      bullets: [
        { lines: [86, 36], wrapsAt: "narrow" },
        { lines: [92], wrapsAt: "medium" },
        { lines: [66, 40] },
      ],
    },
    {
      key: "trivia",
      subline: "text",
      isStretch: true,
      body: "bullets",
      bullets: [{ lines: [82, 94] }, { lines: [92, 36] }],
    },
    { key: "progress", subline: "pill", body: "up-next" },
    { key: "social", subline: "text", body: "people" },
  ];

  const SCORES = ["trakt", "imdb", "tomatoes", "audience"];
  const PEOPLE = ["first", "second"];
</script>

{#snippet bar(width: string)}
  <span class="skeleton-bar" style:--bar-width={width}>
    <SkeletonShimmer />
  </span>
{/snippet}

<div class="trakt-summary-header-skeleton" aria-hidden="true">
  <div class="skeleton-band">
    <SkeletonShimmer radius="0" />
  </div>

  <div class="skeleton-content">
    <div class="skeleton-poster">
      <SkeletonShimmer radius="var(--border-radius-m)" />
    </div>

    <div class="skeleton-kicker">{@render bar("var(--ni-280)")}</div>

    <div class="skeleton-title">
      <SkeletonShimmer radius="var(--border-radius-s)" />
    </div>

    <div class="skeleton-byline">
      {@render bar("var(--ni-300)")}
      <span class="skeleton-byline-mark">
        <SkeletonShimmer radius="var(--border-radius-pill)" />
      </span>
    </div>

    <div class="skeleton-scores">
      {#each SCORES as score (score)}
        <span class="skeleton-score" data-score={score}>
          <SkeletonShimmer />
        </span>
      {/each}
    </div>

    <div class="skeleton-deck">
      {@render bar("100%")}
      {@render bar("94%")}
    </div>

    <!--
      Unguarded, unlike the masthead's: only signed-in directors get the
      masthead, and the session is often still resolving while this shows.
    -->
    <div class="skeleton-actions">
      <span class="skeleton-tray">
        <SkeletonShimmer radius="var(--skeleton-tray-radius)" />
      </span>
      <span class="skeleton-watch-line">
        <SkeletonShimmer radius="var(--border-radius-pill)" />
      </span>
    </div>

    <div class="skeleton-strip">
      {#each COLUMNS as column (column.key)}
        <div class="skeleton-column" class:is-stretch={column.isStretch}>
          <div class="skeleton-column-head">
            <div class="skeleton-label">{@render bar("var(--ni-64)")}</div>

            <div class="skeleton-subline">
              {#if column.subline === "pill"}
                <span class="skeleton-state-pill">
                  <SkeletonShimmer radius="var(--border-radius-pill)" />
                </span>
              {:else}
                {@render bar("var(--ni-88)")}
              {/if}
            </div>
          </div>

          {#if column.body === "bullets"}
            <div class="skeleton-bullets">
              {#each column.bullets as bullet, index (index)}
                <div class="skeleton-bullet">
                  <span class="skeleton-bullet-dot">
                    <SkeletonShimmer radius="var(--border-radius-pill)" />
                  </span>
                  <div class="skeleton-bullet-text">
                    {#each bullet.lines as width, line (line)}
                      <div class="skeleton-body-line">
                        {@render bar(`${width}%`)}
                      </div>
                    {/each}
                    {#if bullet.wrapsAt}
                      <div
                        class="skeleton-body-line is-wrap"
                        data-wraps-at={bullet.wrapsAt}
                      >
                        {@render bar("40%")}
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {:else if column.body === "up-next"}
            <div class="skeleton-up-next">
              <div class="skeleton-caps-line">{@render bar("var(--ni-52)")}</div>
              <div class="skeleton-episode-line">
                {@render bar("var(--ni-52)")}
              </div>
              <div class="skeleton-caps-line is-spaced">
                {@render bar("var(--ni-124)")}
              </div>
              <div class="skeleton-body-line">{@render bar("var(--ni-88)")}</div>
              <div class="skeleton-small-line">{@render bar("92%")}</div>
            </div>
          {:else}
            <div class="skeleton-people">
              {#each PEOPLE as person (person)}
                <div class="skeleton-person">
                  <span class="skeleton-avatar">
                    <SkeletonShimmer radius="var(--border-radius-pill)" />
                  </span>
                  <div class="skeleton-person-text">
                    <div class="skeleton-body-line">
                      {@render bar("var(--ni-88)")}
                    </div>
                    <div class="skeleton-small-line">
                      {@render bar("var(--ni-64)")}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./components/header-kit/backdropDissolve" as dissolve;

  .trakt-summary-header-skeleton {
    --skeleton-poster-width: clamp(
      var(--ni-132),
      min(19vw, 26vh),
      var(--ni-240)
    );
    --skeleton-poster-height: calc(var(--skeleton-poster-width) * 1.5);
    --skeleton-rhythm: var(--gap-m);
    --skeleton-poster-overhang: var(--ni-32);

    position: relative;
    box-sizing: border-box;
    max-width: var(--list-inner-width);
    margin: calc(var(--skeleton-rhythm) + var(--skeleton-poster-overhang))
      var(--layout-distance-side) var(--skeleton-rhythm);

    border-radius: var(--border-radius-l);
    background: var(--color-background);

    &::before {
      @include dissolve.masthead-stroke;
    }
  }

  /* The band dissolves on the masthead's own curve, not a hard edge. */
  .skeleton-band {
    position: relative;
    height: calc(
      var(--skeleton-poster-height) - var(--skeleton-poster-overhang)
    );

    overflow: hidden;
    border-start-start-radius: var(--border-radius-l);
    border-start-end-radius: var(--border-radius-l);

    @include dissolve.backdrop-dissolve;
  }

  .skeleton-content {
    position: relative;
    z-index: var(--layer-floating);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--skeleton-rhythm);

    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    box-sizing: border-box;
    padding: 0 clamp(var(--gap-m), 8vw, var(--ni-120)) var(--ni-28);
    margin-top: calc(-1 * var(--skeleton-poster-height));
  }

  .skeleton-poster {
    position: relative;
    width: var(--skeleton-poster-width);
    height: var(--skeleton-poster-height);
  }

  .skeleton-bar {
    position: relative;
    display: block;
    width: min(100%, var(--bar-width));
    height: max(1cap, var(--ni-8));
  }

  /* Every text row is its line's own box, the bar centred on the ink. */
  .skeleton-kicker,
  .skeleton-label,
  .skeleton-subline,
  .skeleton-body-line,
  .skeleton-small-line,
  .skeleton-caps-line,
  .skeleton-episode-line {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .skeleton-kicker {
    justify-content: center;
    height: var(--ni-14);
    font-size: var(--font-size-tag);
  }

  /* The title is trimmed to its cap height, so its box is one cap tall. */
  .skeleton-title {
    position: relative;

    font-size: calc(
      clamp(var(--ni-32), 5.2vw, var(--ni-66)) * var(--title-scale, 0.85)
    );
    width: 5em;
    max-width: 100%;
    height: 1cap;
  }

  .skeleton-byline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    width: 100%;
    height: var(--ni-28);
    margin-top: var(--gap-xs);
    font-size: var(--ni-16);
  }

  .skeleton-byline-mark {
    position: relative;
    flex: none;
    width: var(--ni-22);
    height: var(--ni-22);
  }

  /* The masthead's trade: padding for the hover surface, negative margins
     so the row keeps its place. */
  .skeleton-scores {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-14);

    box-sizing: border-box;
    height: var(--ni-40);
    padding: var(--ni-8) var(--ni-12);
    margin: calc(var(--gap-xs) - var(--skeleton-rhythm) - var(--ni-8))
      calc(-1 * var(--ni-12)) calc(-1 * var(--ni-8));
  }

  .skeleton-score {
    position: relative;
    width: var(--ni-44);
    height: var(--ni-16);

    &[data-score="imdb"] {
      width: var(--ni-56);
    }
  }

  /* Two clamped lines, trimmed cap to baseline like the deck. The measure
     is read at the deck's 20px, the lines at the size the text renders. */
  .skeleton-deck {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: min(100%, 58ch);
    font-size: var(--ni-20);

    > .skeleton-bar {
      font-size: var(--font-size-text);
      line-height: 1.55;
    }

    > .skeleton-bar + .skeleton-bar {
      margin-top: calc(1lh - 1cap);
    }
  }

  .skeleton-actions {
    --skeleton-tray-radius: var(--border-radius-pill);

    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--gap-xxs);
    width: 100%;
  }

  .skeleton-tray {
    position: relative;
    width: min(100%, calc(var(--ni-640) + var(--ni-80)));
    height: var(--ni-56);

    /* Where to watch leaves the tray for its own pill below it. */
    @include for-tablet-lg-and-below {
      width: min(100%, calc(var(--ni-640) - var(--ni-20)));
    }

    /* The bar on its own row; how you felt and your score share the next. */
    @include for-tablet-sm-and-below {
      --skeleton-tray-radius: var(--ni-28);

      width: min(calc(100vw - var(--ni-32)), var(--ni-340));
      height: calc(
        var(--ni-56) + var(--ni-2) + var(--ni-40) + 2 * var(--ni-4)
      );
    }
  }

  .skeleton-watch-line {
    position: relative;
    display: none;

    width: var(--ni-160);
    height: var(--ni-40);
    margin-top: var(--ni-12);

    @include for-tablet-lg-and-below {
      display: block;
    }
  }

  /*
    The masthead's strip: a centred row of weighted columns on desktop, the
    carousel's first page below it - three columns, then two - with room for
    its arrows either side.
  */
  .skeleton-strip {
    --strip-columns: 4;

    display: flex;
    justify-content: center;
    gap: var(--ni-32);

    width: 100%;
    box-sizing: border-box;
    padding-top: var(--ni-20);

    @include for-tablet-lg-and-below {
      --strip-columns: 3;
      padding-inline: var(--ni-22);
    }

    @include for-tablet-sm-and-below {
      --strip-columns: 2;
    }
  }

  .skeleton-column {
    container-type: inline-size;

    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    flex: 1 1 0;
    min-width: 0;
    max-width: calc(
      (100% - (var(--strip-columns) - 1) * var(--ni-32)) /
        var(--strip-columns)
    );

    @include for-tablet-lg-and-below {
      &:nth-child(n + 4) {
        display: none;
      }

      &.is-stretch {
        flex-grow: 1.4;
        max-width: calc(
          (100% - (var(--strip-columns) - 2) * var(--ni-32)) /
            (var(--strip-columns) - 1)
        );
      }
    }

    @include for-tablet-sm-and-below {
      &:nth-child(n + 3) {
        display: none;
      }
    }
  }

  .skeleton-column-head {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .skeleton-label {
    height: var(--ni-24);
    font-size: var(--font-size-text-small);
  }

  .skeleton-subline {
    height: var(--ni-22);
    font-size: var(--font-size-text-small);
  }

  .skeleton-state-pill {
    position: relative;
    width: var(--ni-74);
    height: var(--ni-22);
  }

  .skeleton-body-line {
    height: var(--ni-20);
    font-size: var(--font-size-text);
  }

  .skeleton-small-line {
    height: var(--ni-16);
    font-size: var(--font-size-text-small);
  }

  .skeleton-body-line + .skeleton-small-line {
    margin-top: var(--ni-4);
  }

  .skeleton-caps-line {
    height: var(--ni-14);
    font-size: var(--font-size-tag);

    &.is-spaced {
      margin-top: var(--ni-18);
    }
  }

  .skeleton-episode-line {
    height: var(--ni-22);
    font-size: var(--ni-16);
  }

  .skeleton-bullets,
  .skeleton-people {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .skeleton-bullet {
    display: flex;
    gap: var(--ni-10);
  }

  .skeleton-bullet-dot {
    position: relative;
    flex: none;
    width: var(--ni-6);
    height: var(--ni-6);
    margin-block: calc((var(--ni-20) - var(--ni-6)) / 2);
  }

  .skeleton-bullet-text,
  .skeleton-person-text {
    flex: 1;
    min-width: 0;
  }

  /* The line a bullet loses to a narrow column, as the real copy does. */
  .skeleton-body-line.is-wrap {
    display: none;

    &[data-wraps-at="medium"] {
      @container (max-width: 220px) {
        display: flex;
      }
    }

    &[data-wraps-at="narrow"] {
      @container (max-width: 180px) {
        display: flex;
      }
    }
  }

  .skeleton-person {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    height: var(--ni-44);
  }

  .skeleton-avatar {
    position: relative;
    flex: none;
    width: var(--ni-44);
    height: var(--ni-44);
  }
</style>
