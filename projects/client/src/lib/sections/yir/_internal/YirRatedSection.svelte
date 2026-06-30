<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/paraglide/messages";
  import type {
    YirRatingCount,
    YirTopRatedItem,
  } from "$lib/requests/models/YirDetail";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirPageInner from "./YirPageInner.svelte";
  import YirRatingsBar from "./YirRatingsBar.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  const {
    type,
    items,
    ratingsDistribution,
  }: {
    type: "shows" | "movies";
    items: YirTopRatedItem[];
    /** All-time only: full 1-10 ratings breakdown shown below the posters. */
    ratingsDistribution?: YirRatingCount[];
  } = $props();

  const ratingSegments = $derived(
    (ratingsDistribution ?? []).filter((datum) => datum.count > 0),
  );

  const sectionTitle = $derived(
    type === "shows"
      ? m.yir_section_title_highest_rated_shows()
      : m.yir_section_title_highest_rated_movies(),
  );

  let activeIndex = $state(0);

  function itemUrl(item: YirTopRatedItem): string {
    return UrlBuilder.media(
      type === "shows" ? "show" : "movie",
      item.entry.slug,
    );
  }
</script>

<section class="trakt-yir-rated-section" id="section-{type}-ratings">
  {#each items as item, index (item.entry.id)}
    <div
      class="yir-fanart-bg"
      class:current={index === activeIndex}
      style:background-image="url({item.entry.cover?.url?.medium ?? ''})"
    ></div>
  {/each}

  <div class="yir-rated-inner" class:has-ratings={ratingSegments.length > 0}>
    <YirSectionHeader>
      {sectionTitle}
    </YirSectionHeader>

    <YirPageInner>
      <div class="yir-posters">
        {#each items as item, index (item.entry.id)}
          <div class="yir-grid-item" title={item.entry.title}>
            <Link
              href={itemUrl(item)}
              label={item.entry.title}
              onmouseenter={() => {
                activeIndex = index;
              }}
            >
              <div class="yir-poster">
                <img
                  class="yir-poster-img"
                  src={item.entry.poster?.url?.thumb}
                  alt={item.entry.title}
                />
              </div>
              <div class="yir-rating">
                <UserRating rating={item.rating} />
              </div>
            </Link>
          </div>
        {/each}
      </div>
    </YirPageInner>

    {#if ratingSegments.length > 0}
      <YirSectionHeader>
        {m.yir_section_title_all_ratings()}
      </YirSectionHeader>

      <YirPageInner>
        <YirRatingsBar distribution={ratingSegments} {type} />
      </YirPageInner>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-rated-section {
    // Poster hero: fanart + posters + white text in both themes (see
    // YirTitleSection for the token-pinning rationale).
    --color-yir-text-primary: var(--color-yir-poster-foreground);
    --color-yir-border: var(--color-yir-poster-foreground);
    --color-yir-title-chip-background: var(--color-yir-scrim);

    text-align: center;
    position: relative;
    background-color: var(--color-yir-poster-background);
    color: var(--color-yir-poster-foreground);
  }

  .yir-fanart-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: all 0.5s;

    &.current {
      opacity: 1;
    }
  }

  .yir-rated-inner {
    position: relative;
    z-index: 1;
    background-color: var(--color-yir-scrim-soft);
    padding-bottom: var(--ni-72);

    // All-time only: bottom-to-top fade from 70% black to transparent so the
    // ratings bar sitting there reads clearly against the fanart.
    &.has-ratings {
      background-image: linear-gradient(
        to top,
        color-mix(in srgb, var(--color-yir-poster-surface) 70%, transparent) 0%,
        transparent 100%
      );
    }

    @include for-mobile {
      padding-bottom: var(--ni-40);

      // Match the charts' generous mobile side inset for the ratings bar.
      :global(.trakt-segmented-bar) {
        padding-inline: 5%;
      }
    }
  }

  .yir-posters {
    display: flex;
    flex-wrap: wrap;
    // Center each row so a partial row (fewer items than a full row, or a
    // wrapped last row) sits centered instead of hugging the start edge.
    justify-content: center;
    gap: var(--ni-16) var(--ni-12);

    // Larger resolutions: up to 10 rated titles per row.
    > .yir-grid-item {
      flex: 0 0 calc((100% - 9 * var(--ni-12)) / 10);
    }

    &:hover .yir-grid-item:not(:hover) {
      .yir-poster-img,
      .yir-rating {
        opacity: 0.3;
      }
    }

    @include for-tablet-sm {
      > .yir-grid-item {
        flex: 0 0 calc((100% - 4 * var(--ni-12)) / 5);
      }
    }

    @include for-mobile {
      // Match the charts' generous mobile side inset.
      padding-inline: 5%;

      > .yir-grid-item {
        flex: 0 0 calc((100% - 2 * var(--ni-12)) / 3);
      }
    }
  }

  .yir-grid-item {
    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }
  }

  .yir-poster {
    border: none;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background-color: var(--color-yir-poster-surface);
    box-shadow: 0 0 var(--ni-20) var(--color-yir-poster-surface);
    position: relative;

    .yir-poster-img {
      transition: all 0.5s;
    }
  }

  .yir-poster-img {
    width: 100%;
    display: block;
    aspect-ratio: 2 / 3;
    object-fit: cover;
  }

  // 5-point star rating (shared v3 UserRating), centered beneath the poster.
  .yir-rating {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--ni-8);
    color: var(--color-yir-poster-foreground);
    transition: all 0.5s;
  }
</style>
