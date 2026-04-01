<script lang="ts">
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { languageTag } from "$lib/features/i18n";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    type,
    items,
  }: {
    type: "shows" | "movies";
    items: YirMostWatchedItem[];
  } = $props();

  const typeLabel = $derived(type === "shows" ? "show" : "movie");

  let activeIndex = $state(0);

  function itemUrl(item: YirMostWatchedItem): string {
    return UrlBuilder.media(type === "shows" ? "show" : "movie", item.entry.slug);
  }

  function formatMinutes(minutes: number): string {
    return toHumanDuration({ minutes }, languageTag());
  }
</script>

<section class="yir-most-watched-section" id="section-{type}-most-watched">
  <!-- Featured card area with fanart backgrounds -->
  <div class="yir-most-watched-page">
    {#each items as item, index}
      <div
        class="yir-fanart-bg"
        class:current={index === activeIndex}
        style:background-image="url({item.entry.cover.url.medium})"
      >
        <div class="yir-shade"></div>
        <div class="yir-page-inner">
          <div class="yir-section-header">
            <h2>
              <span class="yir-header-number">
                <span class="yir-hash">#</span>{index + 1}
              </span>
              <span class="yir-header-text">{m.yir_label_most_watched({ type: typeLabel })}</span>
            </h2>
          </div>

          <a href={itemUrl(item)} class="yir-card-media">
            <div class="yir-logo-wrapper">
              {#if item.entry.logo.url.medium}
                <img
                  class="yir-card-logo"
                  src={item.entry.logo.url.medium}
                  alt={item.entry.title}
                />
              {:else}
                <h3 class="yir-card-title">{item.entry.title}</h3>
              {/if}
            </div>
          </a>

          <div class="yir-card-stats">
            <div class="yir-stat-line">
              {formatMinutes(item.minutes)}
            </div>
            <div class="yir-stat-line">
              {item.plays.toLocaleString()}
              {item.plays === 1 ? "play" : "plays"}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Thumbnail grid -->
  <div class="yir-most-watched-grid">
    {#each items as item, index}
      <a
        href={itemUrl(item)}
        class="yir-grid-item"
        onmouseenter={() => {
          activeIndex = index;
        }}
      >
        <div class="yir-rank-wrapper">
          <span class="yir-rank">{index + 1}</span>
        </div>
        <img
          class="yir-grid-thumb"
          src={item.entry.thumb.url}
          alt={item.entry.title}
        />
      </a>
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-most-watched-section {
    background-color: var(--shade-950);
    text-align: center;
    position: relative;
  }

  .yir-most-watched-page {
    position: relative;
    height: 530px;

    @include for-mobile {
      height: 430px;
    }
  }

  .yir-fanart-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 1;
    opacity: 0;
    transition: all 0.5s;

    &.current {
      opacity: 1;
      z-index: 2;
    }
  }

  .yir-shade {
    position: absolute;
    inset: 0;
    background: radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  }

  .yir-page-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: none;
    padding: 0;
  }

  .yir-section-header {
    padding: 0;
  }

  .yir-header-number {
    display: inline-block;
    background-color: #fff;
    color: #000;
    padding: 6px 8px;
    margin-right: -3px;
  }

  .yir-hash {
    font-size: 14px;
  }

  .yir-card-media {
    text-decoration: none;
    color: #fff;
    margin-top: var(--ni-20);
  }

  .yir-logo-wrapper {
    .yir-card-logo {
      max-width: 70%;
      width: 300px;
    }
  }

  .yir-card-title {
    font-size: 40px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    margin: 0;

    @include for-mobile {
      font-size: 32px;
    }
  }

  .yir-card-stats {
    margin-top: 70px;
  }

  .yir-stat-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 5px;
    font-size: 18px;
  }

  .yir-most-watched-grid {
    display: flex;
    position: relative;
    z-index: 3;

    &:hover {
      .yir-grid-item {
        opacity: 0.3;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .yir-grid-item {
    flex: 1;
    position: relative;
    transition: all 0.5s;
    cursor: pointer;

    @include for-tablet-sm-and-below {
      flex: 0 0 20%;
    }

    @include for-mobile {
      flex: 0 0 50%;
    }
  }

  .yir-rank-wrapper {
    position: absolute;
    z-index: 1;
    left: 0;
    top: -11px;
    text-align: center;
    width: 100%;
  }

  .yir-rank {
    background-color: #333;
    color: #fff;
    display: inline-block;
    font-size: 11px;
    font-weight: bold;
    border: solid 2px #fff;
    border-radius: 50%;
    height: 22px;
    width: 22px;
    line-height: 2.2;
  }

  .yir-grid-thumb {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
</style>
