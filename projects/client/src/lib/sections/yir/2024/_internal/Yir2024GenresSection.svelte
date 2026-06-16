<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail.ts";
  import YirGenreBars from "../../_internal/YirGenreBars.svelte";
  import Yir2024StatSummary from "./Yir2024StatSummary.svelte";

  type Yir2024GenresSectionProps = {
    type: "shows" | "movies";
    genres: YirGenresGroup;
  };

  const { type, genres }: Yir2024GenresSectionProps = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_2024_most_watched_show_genres()
      : m.yir_2024_most_watched_movie_genres(),
  );

  const watermark = $derived(
    type === "shows"
      ? m.yir_2024_genres_watermark_show()
      : m.yir_2024_genres_watermark_movie(),
  );

  const mostWatched = $derived(genres.genres[0]);
  const leastWatched = $derived(
    genres.genres.length > 1
      ? genres.genres[genres.genres.length - 1]
      : undefined,
  );

  // FIXME(i18n): hardcoded English plurals match the existing convention
  // across the YIR module. Migrate holistically when i18n keys are added
  // across all YIR sections.
  function itemUnit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<section class="trakt-yir-2024-genres-section" id="section-{type}-genres">
  <div class="yir-2024-genres-panel">
    <span class="bold yir-2024-genres-watermark" aria-hidden="true">
      {watermark}
    </span>

    <div class="yir-2024-genres-top">
      <h2 class="bold yir-2024-genres-heading">{heading}</h2>

      <Yir2024StatSummary
        {mostWatched}
        {leastWatched}
        countLabel={m.yir_2024_genre_count()}
        total={genres.genres.length}
        unit={itemUnit}
      />
    </div>

    <div class="yir-2024-genres-bars">
      <YirGenreBars {type} {genres} variant="filled" />
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-genres-section {
    width: 100%;
  }

  // Rounded panel sharing the stats section's blue-tinted radial fill so
  // the two sections read as a set. overflow:hidden clips the oversized
  // watermark to the panel bounds.
  .yir-2024-genres-panel {
    --panel-padding-x: var(--ni-44);
    --panel-padding-y: var(--ni-44);
    --panel-radius: var(--ni-64);

    position: relative;
    overflow: hidden;
    padding: var(--panel-padding-y) var(--panel-padding-x);
    border-radius: var(--panel-radius);
    background: radial-gradient(
      50% 39.27% at 50% 0%,
      color-mix(in srgb, var(--shade-950) 90%, var(--blue-500) 10%) 0%,
      color-mix(in srgb, var(--shade-950) 70%, var(--shade-900) 30%) 100%
    );

    @include for-mobile {
      --panel-padding-x: var(--ni-20);
      --panel-padding-y: var(--ni-20);
      --panel-radius: var(--ni-32);
    }
  }

  // Faint oversized label sitting behind the heading; clipped on the right
  // by the panel's overflow. Tonal-only (low-opacity white over the dark
  // panel), matching the stats section watermark treatment.
  .yir-2024-genres-watermark {
    position: absolute;
    top: var(--ni-72);
    left: var(--panel-padding-x);
    right: 0;
    font-size: clamp(var(--ni-72), 12vw, var(--ni-160));
    line-height: 1;
    white-space: nowrap;
    text-transform: lowercase;
    color: var(--shade-10);
    opacity: 0.04;
    pointer-events: none;
    user-select: none;

    @include for-mobile {
      top: var(--ni-44);
    }
  }

  // Heading on the left, stat summary on the right. Stacks on smaller
  // screens.
  .yir-2024-genres-top {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--ni-44);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      gap: var(--ni-24);
    }
  }

  .yir-2024-genres-heading {
    flex: 1;
    min-width: 0;
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    line-height: 1.05;
    color: var(--shade-10);

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  // Stat list rendered by Yir2024StatSummary (its own scope), reached with
  // :global to constrain its column width on desktop.
  .yir-2024-genres-top :global(.trakt-yir-2024-stat-summary) {
    flex: 0 1 var(--ni-360);
    min-width: 0;

    @include for-tablet-sm-and-below {
      flex: none;
      width: 100%;
    }
  }

  // Genre names arrive lowercase from the API; title-case them in the stat
  // rows (companies names are already proper, so this stays scoped to the
  // genres section rather than the shared stat-summary component).
  .yir-2024-genres-top :global(.yir-2024-stat-name) {
    text-transform: capitalize;
  }

  // Bars span the full panel width beneath the top row. Negative inline
  // margin bleeds past the panel padding so the bar strip reaches closer to
  // the panel edges (the bar component carries its own small inset).
  .yir-2024-genres-bars {
    position: relative;
    z-index: 1;
    margin: var(--ni-32) calc(-1 * var(--panel-padding-x)) 0;

    @include for-mobile {
      margin-top: var(--ni-20);
    }
  }
</style>
