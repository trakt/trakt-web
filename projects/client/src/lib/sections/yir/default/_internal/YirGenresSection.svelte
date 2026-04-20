<script lang="ts">
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";

  const {
    type,
    genres,
  }: {
    type: "shows" | "movies";
    genres: YirGenresGroup;
  } = $props();

  const sectionTitle = $derived(
    type === "shows" ? m.yir_section_title_show_genres() : m.yir_section_title_movie_genres(),
  );

  const typeLabel = $derived(
    type === "shows" ? "show" : "movie",
  );

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
</script>

<section class="yir-genres-section" id="section-{type}-genres">
  <div class="yir-page-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{sectionTitle}</span>
      </h2>
    </div>

    <div class="yir-genre-bars">
      {#each genres.genres as genre, index}
        {@const percentage = (genre.count / genres.itemCount) * 100}
        {@const maxCount = genres.genres[0]?.count ?? 1}
        {@const relativePercentage = (genre.count / maxCount) * 100}
        <div class="yir-genre-row" data-index={index}>
          <div class="yir-genre-info" style:border-left-color={getBarColor(index)}>
            <span class="yir-genre-name">{genre.name}</span>
            <span class="yir-genre-count">
              {genre.count.toLocaleString()} {genre.count === 1 ? typeLabel : `${typeLabel}s`}
            </span>
          </div>
          <div
            class="yir-genre-bar"
            style:--bar-width="{Math.max(percentage, 5)}%"
            style:--mobile-bar-width="{relativePercentage}%"
            style:background-color={getBarColor(index)}
          >
            <span class="yir-genre-percentage">{Math.round(percentage)}%</span>
            <span class="yir-genre-label" style:border-color={getBarColor(index)}>
              {genre.name}
              <span class="yir-genre-count-desktop">
                {genre.count.toLocaleString()} {genre.count === 1 ? typeLabel : `${typeLabel}s`}
              </span>
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-genres-section {
    background-color: var(--shade-1000);
  }

  .yir-page-inner {
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-section-header {
    padding: var(--ni-72) 0;

    @include for-mobile {
      padding: var(--ni-40) 0;
    }
  }

  .yir-genre-bars {
    display: flex;
    padding: var(--ni-40) var(--ni-16) var(--ni-60) var(--ni-16);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &:hover .yir-genre-bar {
      opacity: 0.5;

      .yir-genre-percentage {
        opacity: 1;
      }
    }

    @include for-mobile {
      flex-direction: column;
      padding: 0 var(--ni-16);
      overflow: visible;
    }
  }

  .yir-genre-row {
    display: contents;

    @include for-mobile {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--ni-16);
    }
  }

  .yir-genre-info {
    display: none;

    @include for-mobile {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--ni-2);
      padding-left: var(--ni-6);
      border-left: var(--border-thickness-xxs) solid;
    }
  }

  .yir-genre-name {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shade-10);
    font-weight: 500;
    line-height: 1.2;
  }

  .yir-genre-bar {
    height: var(--ni-30);
    margin-left: var(--ni-2);
    position: relative;
    min-width: var(--ni-44);
    width: var(--bar-width);
    transition: all 0.5s;
    cursor: pointer;

    &:hover {
      opacity: 1 !important;
    }

    @include for-mobile {
      height: var(--ni-30);
      min-height: var(--ni-30);
      width: var(--mobile-bar-width) !important;
      margin-left: 0;
      margin-bottom: 0;
      display: block;
    }
  }

  .yir-genre-row:first-child .yir-genre-bar {
    margin-left: 0;
  }

  .yir-genre-percentage {
    color: var(--shade-1000);
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    top: var(--ni-8);
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.5s;

    @include for-mobile {
      display: none;
    }
  }

  .yir-genre-label {
    position: absolute;
    left: 0;
    bottom: var(--ni-30);
    font-size: 12px;
    text-transform: uppercase;
    white-space: nowrap;
    padding: var(--ni-4) var(--ni-6);
    color: var(--shade-10);
    border-left: var(--border-thickness-xs) solid;
    pointer-events: none;

    @include for-mobile {
      display: none;
    }
  }

  .yir-genre-row[data-index]:nth-child(even) .yir-genre-label {
    top: var(--ni-30);
    bottom: auto;
  }

  .yir-genre-count {
    font-size: 12px;
    color: var(--shade-400);
    text-transform: uppercase;
  }

  .yir-genre-count-desktop {
    display: block;
    font-size: 10px;
    color: var(--shade-400);
    text-transform: uppercase;
  }
</style>
