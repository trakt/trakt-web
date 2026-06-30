<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { yirUnit } from "../../_internal/yirUnit.ts";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  const {
    type,
    items,
  }: {
    type: "shows" | "movies";
    items: YirMostWatchedItem[];
  } = $props();

  // Localized singular noun fed into the "most watched {type}" label.
  const typeLabel = $derived(
    type === "shows" ? m.yir_unit_show() : m.yir_unit_movie(),
  );

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

<section class="trakt-yir-most-watched-section" id="section-{type}-most-watched">
  <!-- Featured card area with fanart backgrounds -->
  <div class="yir-most-watched-page">
    {#each items as item, index (item.entry.id)}
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

          <div class="yir-card-media">
            <Link href={itemUrl(item)} color="inherit">
              <div class="yir-logo-wrapper">
                {#if !PLACEHOLDERS.includes(item.entry.logo.url.medium)}
                  <img
                    class="yir-card-logo"
                    src={item.entry.logo.url.medium}
                    alt={item.entry.title}
                  />
                {:else}
                  <h3 class="yir-card-title">{item.entry.title}</h3>
                {/if}
              </div>
            </Link>
          </div>

          <div class="yir-card-stats">
            <div class="yir-stat-line">
              {formatMinutes(item.minutes)}
            </div>
            <div class="yir-stat-line">
              {item.plays.toLocaleString()}
              {yirUnit(item.plays, m.yir_unit_play, m.yir_unit_plays)}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Thumbnail grid -->
  <div class="yir-most-watched-grid">
    {#each items as item, index (item.entry.id)}
      <div class="yir-grid-item">
        <Link
          href={itemUrl(item)}
          onmouseenter={() => {
            activeIndex = index;
          }}
          color="inherit"
        >
          <div class="yir-rank-wrapper">
            <span class="yir-rank">{index + 1}</span>
          </div>
          <img
            class="yir-grid-thumb"
            src={item.entry.thumb.url}
            alt={item.entry.title}
          />
        </Link>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-most-watched-section {
    // Poster hero: fanart + dark strip + white text in both themes. Pin the
    // shared chrome tokens (incl. the ranked section-header pill) to their
    // always-dark poster values (see YirTitleSection for the rationale).
    --color-yir-text-primary: var(--color-yir-poster-foreground);
    --color-yir-border: var(--color-yir-poster-foreground);
    --color-yir-title-chip-background: var(--color-yir-scrim);
    --color-yir-badge-background: var(--color-yir-poster-foreground);
    --color-yir-badge-foreground: var(--color-yir-poster-surface);

    background-color: var(--color-yir-poster-background);
    color: var(--color-yir-poster-foreground);
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
    background: radial-gradient(var(--color-yir-scrim), transparent);
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
    margin-top: var(--ni-20);
    color: var(--color-yir-poster-foreground);

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }
  }

  .yir-logo-wrapper {
    .yir-card-logo {
      max-width: 70%;
      width: var(--ni-300);
    }
  }

  .yir-card-title {
    font-size: var(--ni-32);
    text-shadow: var(--ni-1) var(--ni-1) var(--ni-2) var(--color-yir-scrim);
    margin: 0;

    @include for-mobile {
      font-size: var(--ni-24);
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
    font-size: var(--ni-18);
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
    background-color: var(--color-yir-poster-surface);
    border-radius: var(--border-radius-s);
    // Drop-shadow follows the alpha outline (incl. the first/last thumbs'
    // rounded corners), so the strip reads as floating above the fanart.
    filter: drop-shadow(0 var(--ni-4) var(--ni-12) var(--color-yir-scrim));

    &:hover {
      .yir-grid-item {
        opacity: 0.3;

        &:hover {
          opacity: 1;
        }
      }
    }

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
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
    border-start-start-radius: var(--border-radius-s);
    border-end-start-radius: var(--border-radius-s);
  }

  .yir-grid-item:last-child .yir-grid-thumb {
    border-start-end-radius: var(--border-radius-s);
    border-end-end-radius: var(--border-radius-s);
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
    inset-inline-start: 0;
    top: var(--ni-neg-12);
    text-align: center;
    width: 100%;
  }

  .yir-rank {
    --rank-size: var(--ni-22);

    background-color: var(--color-yir-poster-chip);
    color: var(--color-yir-poster-foreground);
    display: inline-block;
    font-size: var(--ni-12);
    font-weight: bold;
    border: var(--border-thickness-xs) solid var(--color-yir-poster-foreground);
    border-radius: 50%;
    height: var(--rank-size);
    width: var(--rank-size);
    line-height: var(--rank-size);
  }

  .yir-grid-thumb {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
</style>
