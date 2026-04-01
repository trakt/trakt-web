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
    background-color: #090909;
  }

  .yir-page-inner {
    padding-bottom: 70px;

    @include for-mobile {
      padding-bottom: 40px;
    }
  }

  .yir-section-header {
    padding: 70px 0;

    @include for-mobile {
      padding: 40px 0;
    }
  }

  .yir-genre-bars {
    display: flex;
    padding: 40px var(--ni-16) 60px var(--ni-16);
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
      margin-bottom: 16px;
    }
  }

  .yir-genre-info {
    display: none;

    @include for-mobile {
      display: flex;
      flex-direction: column;
      margin-bottom: 2px;
      padding-left: 6px;
      border-left: 1px solid;
    }
  }

  .yir-genre-name {
    font-size: 14px;
    text-transform: uppercase;
    color: #fff;
    font-weight: 500;
    line-height: 1.2;
  }

  .yir-genre-bar {
    height: 30px;
    margin-left: 2px;
    position: relative;
    min-width: 45px;
    width: var(--bar-width);
    transition: all 0.5s;
    cursor: pointer;

    &:hover {
      opacity: 1 !important;
    }

    @include for-mobile {
      height: 30px;
      min-height: 30px;
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
    color: #000;
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    top: 7px;
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
    bottom: 30px;
    font-size: 12px;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 4px 6px;
    color: #fff;
    border-left: 2px solid;
    pointer-events: none;

    @include for-mobile {
      display: none;
    }
  }

  .yir-genre-row[data-index]:nth-child(even) .yir-genre-label {
    top: 30px;
    bottom: auto;
  }

  .yir-genre-count {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
  }

  .yir-genre-count-desktop {
    display: block;
    font-size: 10px;
    color: #999;
    text-transform: uppercase;
  }
</style>
