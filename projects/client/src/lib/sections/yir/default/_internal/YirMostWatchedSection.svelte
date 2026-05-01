<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirSectionHeader from "./YirSectionHeader.svelte";

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
    return UrlBuilder.media(
      type === "shows" ? "show" : "movie",
      item.entry.slug,
    );
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
        <div class="yir-featured-card">
          <YirSectionHeader flat rank={index + 1}>
            {m.yir_label_most_watched({ type: typeLabel })}
          </YirSectionHeader>

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
    background: radial-gradient(
      color-mix(in srgb, var(--shade-1000) 80%, transparent),
      transparent
    );
  }

  .yir-featured-card {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .yir-card-media {
    text-decoration: none;
    color: var(--shade-10);
    margin-top: var(--ni-20);
  }

  .yir-logo-wrapper {
    .yir-card-logo {
      max-width: 70%;
      width: var(--ni-300);
    }
  }

  .yir-card-title {
    font-size: 40px;
    text-shadow: var(--ni-1) var(--ni-1) var(--ni-2)
      color-mix(in srgb, var(--shade-1000) 80%, transparent);
    margin: 0;

    @include for-mobile {
      font-size: 32px;
    }
  }

  .yir-card-stats {
    margin-top: var(--ni-72);
  }

  .yir-stat-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xxs);
    margin-top: var(--ni-6);
    font-size: 18px;
  }

  .yir-most-watched-grid {
    display: flex;
    position: relative;
    z-index: 3;
    // Side margin (not padding) so the rounded outer corners and drop-
    // shadow trace the actual thumbnail strip. The negative top margin
    // lifts the strip so roughly half of it overlays the fanart hero —
    // 16:9 thumbs across 10 items make the strip ~5.6% of its width tall,
    // so -3% lifts ~half.
    margin: -2.5% var(--layout-sidebar-distance) 0;
    // Solid backdrop so hover-faded thumbs reveal this dark color instead
    // of bleeding the fanart through.
    background-color: var(--shade-1000);
    border-radius: var(--border-radius-s);
    // Drop-shadow follows the alpha outline (incl. the first/last thumbs'
    // rounded corners), so the strip reads as floating above the fanart.
    filter: drop-shadow(
      0 var(--ni-4) var(--ni-12)
        color-mix(in srgb, var(--shade-1000) 70%, transparent)
    );

    &:hover {
      .yir-grid-item {
        opacity: 0.3;

        &:hover {
          opacity: 1;
        }
      }
    }

    @include for-tablet-sm-and-below {
      // Full-bleed strip on smaller screens — no rounded corners,
      // no lift. Horizontal scroll lets all 10 thumbs be reached.
      // overflow-x:auto forces overflow-y to clip per CSS spec, which
      // would cut off the rank circles (positioned top:-12 on each
      // item, ~26px tall with their border). padding-top creates the
      // vertical room they need; matching negative margin-top puts
      // the thumb row back at its natural "below the fanart" position
      // and background-clip keeps the dark backdrop behind the thumbs
      // only — the padding area above is transparent so ranks read
      // against the section bg, like on desktop.
      border-radius: 0;
      overflow-x: auto;
      padding-top: var(--ni-16);
      margin-top: calc(-1 * var(--ni-16));
      background-clip: content-box;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .yir-grid-item:first-child .yir-grid-thumb {
    border-top-left-radius: var(--border-radius-s);
    border-bottom-left-radius: var(--border-radius-s);
  }

  .yir-grid-item:last-child .yir-grid-thumb {
    border-top-right-radius: var(--border-radius-s);
    border-bottom-right-radius: var(--border-radius-s);
  }

  @include for-tablet-sm-and-below {
    .yir-grid-item:first-child .yir-grid-thumb,
    .yir-grid-item:last-child .yir-grid-thumb {
      border-radius: 0;
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
    top: var(--ni-neg-12);
    text-align: center;
    width: 100%;
  }

  .yir-rank {
    background-color: var(--shade-800);
    color: var(--shade-10);
    display: inline-block;
    font-size: 11px;
    font-weight: bold;
    border: var(--border-thickness-xs) solid var(--shade-10);
    border-radius: 50%;
    height: var(--ni-22);
    width: var(--ni-22);
    line-height: 2.2;
  }

  .yir-grid-thumb {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
</style>
