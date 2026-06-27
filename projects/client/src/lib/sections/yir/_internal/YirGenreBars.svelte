<script lang="ts">
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail.ts";

  type YirGenreBarsProps = {
    type: "shows" | "movies";
    genres: YirGenresGroup;
    /**
     * `default` — colored left-border label (legacy template).
     * `filled` — opaque bar-colored label with uppercase text (2024 template).
     */
    variant?: "default" | "filled";
  };

  const { type, genres, variant = "default" }: YirGenreBarsProps = $props();

  const typeLabel = $derived(type === "shows" ? "show" : "movie");

  // Top genre drives the relative (mobile) bar widths; computed once rather
  // than per-row inside the loop.
  const maxCount = $derived(genres.genres[0]?.count ?? 1);

  // Categorical palette for the stacked segments. These are intentionally
  // fixed brand-neutral hues (no semantic theme token maps to "genre #3"),
  // matching the v2 YIR genre bar colors.
  const chartColors = [
    "#CC333F",
    "#00A0B0",
    "#EB6841",
    "#6A4A3C",
    "#EDC951",
    "#AB3E5B",
    "#B3CC57",
    "#EF746F",
    "#3E4147",
    "#FFBE40",
    "#7B3B3B",
  ];

  function getBarColor(index: number): string {
    return chartColors[index % chartColors.length] ?? "#222";
  }

  function unitLabel(count: number): string {
    return count === 1 ? typeLabel : `${typeLabel}s`;
  }

  /*
    FIXME: the horizontal version should deal better with responsiveness,
    without users having to scroll.
    */
</script>

<div class="trakt-yir-genre-bars" data-variant={variant}>
  {#each genres.genres as genre, index (genre.name)}
    {@const percentage = (genre.count / genres.itemCount) * 100}
    {@const relativePercentage = (genre.count / maxCount) * 100}
    <div
      class="yir-genre-row"
      data-index={index}
      style:--genre-color={getBarColor(index)}
    >
      <div class="yir-genre-info">
        <span class="yir-genre-name">{genre.name}</span>
        <span class="yir-genre-count">
          {genre.count.toLocaleString()}
          {unitLabel(genre.count)}
        </span>
      </div>
      <div
        class="yir-genre-bar"
        style:--bar-width="{Math.max(percentage, 5)}%"
        style:--mobile-bar-width="{relativePercentage}%"
      >
        <span class="yir-genre-percentage">{Math.round(percentage)}%</span>
        <span class="yir-genre-label">
          <span class="yir-genre-name-desktop">{genre.name}</span>
          <span class="yir-genre-count-desktop">
            {genre.count.toLocaleString()}
            {unitLabel(genre.count)}
          </span>
        </span>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-genre-bars {
    display: flex;
    padding: var(--ni-40) var(--ni-16) var(--ni-60) var(--ni-16);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &:hover .yir-genre-bar:not(:hover) {
      opacity: 0.5;
    }

    &:hover .yir-genre-bar .yir-genre-percentage {
      opacity: 1;
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      padding: 0 var(--ni-16);
      overflow: visible;
    }
  }

  .yir-genre-row {
    display: contents;

    @include for-tablet-sm-and-below {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--ni-16);
    }
  }

  .yir-genre-info {
    display: none;

    @include for-tablet-sm-and-below {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--ni-2);
      padding-inline-start: var(--ni-6);
      border-inline-start: var(--border-thickness-xxs) solid var(--genre-color);
    }
  }

  .yir-genre-name {
    font-size: var(--font-size-text);
    text-transform: capitalize;
    color: var(--shade-10);
    font-weight: 500;
    line-height: 1.2;
  }

  .yir-genre-name-desktop {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
    font-size: var(--font-size-text);
  }

  .yir-genre-bar {
    height: var(--ni-30);
    margin-inline-start: var(--ni-2);
    position: relative;
    min-width: var(--ni-44);
    width: var(--bar-width);
    background-color: var(--genre-color);
    transition: all 0.5s;
    cursor: pointer;

    @include for-tablet-lg {
      min-width: var(--ni-32);
    }

    @include for-tablet-sm-and-below {
      height: var(--ni-30);
      min-height: var(--ni-30);
      width: var(--mobile-bar-width);
      margin-inline-start: 0;
      margin-bottom: 0;
      display: block;
    }
  }

  .yir-genre-row:first-child .yir-genre-bar {
    margin-inline-start: 0;
  }

  .yir-genre-percentage {
    color: var(--shade-1000);
    position: absolute;
    width: 100%;
    text-align: center;
    inset-inline-start: 0;
    top: var(--ni-8);
    font-size: var(--font-size-text-small);
    opacity: 0;
    transition: opacity 0.5s;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .yir-genre-label {
    position: absolute;
    inset-inline-start: 0;
    bottom: var(--ni-30);
    width: 200%;
    box-sizing: border-box;
    font-size: var(--font-size-text-small);
    white-space: nowrap;
    padding: var(--ni-4) var(--ni-6);
    color: var(--shade-10);
    border-inline-start: var(--border-thickness-xs) solid var(--genre-color);
    pointer-events: none;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .yir-genre-row[data-index]:nth-child(even) .yir-genre-label {
    top: var(--ni-30);
    bottom: auto;
  }

  .yir-genre-count {
    font-size: var(--font-size-text-small);
    color: var(--shade-400);
  }

  .yir-genre-count-desktop {
    display: block;
    font-size: var(--font-size-tag);
    color: var(--shade-400);
  }

  // Filled variant (2024): the label becomes a translucent box tinted with
  // the bar's color and uppercase text, instead of the transparent
  // left-border style. ~31% matches v2's `#RRGGBB50` (0x50 alpha) tint so
  // the panel reads through the label.
  .trakt-yir-genre-bars[data-variant="filled"] {
    .yir-genre-label {
      width: max-content;
      max-width: 200%;
      background-color: color-mix(in srgb, var(--genre-color) 31%, transparent);
      // Full-color 1px left border on top of the translucent fill (matches
      // v2: solid border-color + `#RRGGBB50` background tint).
      border-inline-start: var(--border-thickness-xxs) solid var(--genre-color);
      text-transform: uppercase;
    }

    .yir-genre-name-desktop,
    .yir-genre-name {
      text-transform: uppercase;
    }

    // v2's label name is normal-weight and only marginally larger than the
    // count, not a heavier heading — drop the default's larger ni-14 name
    // down to match the count line and remove the visual weight.
    .yir-genre-name-desktop {
      font-size: var(--font-size-tag);
      font-weight: 400;
    }

    // Count (line 2) reads as a muted gray — white at 60% opacity over the
    // tinted box (matches v2's lighter count text).
    .yir-genre-count-desktop {
      color: color-mix(in srgb, var(--shade-10) 60%, transparent);
    }
  }
</style>
