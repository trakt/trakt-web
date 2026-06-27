<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import ShareCard from "$lib/features/share/ShareCard.svelte";
  import {
    SHARE_TYPE_DIMENSIONS,
    type ShareType,
  } from "$lib/features/share/models/ShareType.ts";
  import { moviePeopleQuery } from "$lib/requests/queries/movies/moviePeopleQuery.ts";
  import { movieRatingQuery } from "$lib/requests/queries/movies/movieRatingQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { showRatingQuery } from "$lib/requests/queries/shows/showRatingQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { combineLatest } from "rxjs";
  import { map } from "rxjs/operators";

  const showSlug = "silo";
  const movieSlug = "the-matrix-1999";

  const variants: ShareType[] = ["open-graph", "feed", "story"];

  const showSummary = useQuery(showSummaryQuery({ slug: showSlug }));
  const showRating = useQuery(showRatingQuery({ slug: showSlug }));
  const showPeople = useQuery(showPeopleQuery({ slug: showSlug }));

  const movieSummary = useQuery(movieSummaryQuery({ slug: movieSlug }));
  const movieRating = useQuery(movieRatingQuery({ slug: movieSlug }));
  const moviePeople = useQuery(moviePeopleQuery({ slug: movieSlug }));

  const showData = combineLatest([showSummary, showRating, showPeople]).pipe(
    map(([summary, rating, people]) => {
      if (!summary.data || !rating.data || !people.data) return undefined;
      return {
        media: summary.data,
        ratings: rating.data,
        crew: people.data,
        posterUrl: summary.data.poster.url.medium,
      };
    }),
  );

  const movieData = combineLatest([
    movieSummary,
    movieRating,
    moviePeople,
  ]).pipe(
    map(([summary, rating, people]) => {
      if (!summary.data || !rating.data || !people.data) return undefined;
      return {
        media: summary.data,
        ratings: rating.data,
        crew: people.data,
        posterUrl: summary.data.poster.url.medium,
      };
    }),
  );

  const showImagePreview = $state<Record<ShareType, boolean>>(
    Object.fromEntries(variants.map((v) => [v, false])) as Record<
      ShareType,
      boolean
    >,
  );

  const imageLoading = $state<Record<string, boolean>>({});

  let containerWidth = $state(0);

  const cardDisplayWidth = $derived.by(() => {
    if (containerWidth <= 0) return 540;
    const gap = 24;
    const twoCol = (containerWidth - gap) / 2;
    return twoCol >= 280 ? twoCol : containerWidth;
  });

  function shareableImageUrl({
    type,
    slug,
    variant,
  }: {
    type: "movie" | "show";
    slug: string;
    variant: ShareType;
  }) {
    const builder = UrlBuilder.api.shareableImage(type, slug);
    switch (variant) {
      case "open-graph":
        return builder.openGraph();
      case "feed":
        return builder.feed();
      case "story":
        return builder.story();
    }
  }

  function getCardDimensions(variant: ShareType) {
    const { width: naturalWidth, height: naturalHeight } =
      SHARE_TYPE_DIMENSIONS[variant];
    const scale = cardDisplayWidth / naturalWidth;
    return {
      scale,
      displayWidth: cardDisplayWidth,
      displayHeight: naturalHeight * scale,
    };
  }
</script>

<main>
  <header class="hero">
    <p class="hero-eyebrow bold">Design System</p>
    <h1>Share Cards</h1>
    <p class="hero-description">
      Shareable image variants generated for social media and open graph embeds.
    </p>
  </header>

  <div class="content" bind:clientWidth={containerWidth}>
    {#each variants as variant, i (variant)}
      {@const { scale, displayWidth, displayHeight } =
        getCardDimensions(variant)}
      {@const { width: nw, height: nh } = SHARE_TYPE_DIMENSIONS[variant]}
      <section>
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-index bold">0{i + 1}</span>
            <h2>{variant}</h2>
            <span class="dimension-badge">{nw} × {nh}</span>
          </div>
          <div class="section-header-end">
            <div class="preview-toggle">
              <span
                class="preview-label"
                class:active={!showImagePreview[variant]}>Component</span
              >
              <Switch
                label="Toggle image preview"
                color="purple"
                checked={showImagePreview[variant]}
                onclick={() => {
                  showImagePreview[variant] = !showImagePreview[variant];
                  if (showImagePreview[variant]) {
                    imageLoading[`${variant}-show`] = true;
                    imageLoading[`${variant}-movie`] = true;
                  }
                }}
              />
              <span
                class="preview-label"
                class:active={showImagePreview[variant]}>Image</span
              >
            </div>
          </div>
        </div>

        <div class="cards-row">
          <figure class="card-figure">
            <div class="card-meta">
              <span class="media-type-badge bold" data-type="show">Show</span>
              <span class="media-slug">silo</span>
            </div>
            <div
              class="card-wrapper"
              style="width: {displayWidth}px; height: {displayHeight}px;"
            >
              {#if showImagePreview[variant]}
                {#if imageLoading[`${variant}-show`]}
                  <div class="card-placeholder"></div>
                {/if}
                <img
                  class="card-image"
                  style={imageLoading[`${variant}-show`] ? "display:none" : ""}
                  src={shareableImageUrl({
                    type: "show",
                    slug: showSlug,
                    variant,
                  })}
                  alt="Generated share card for {showSlug}"
                  width={displayWidth}
                  height={displayHeight}
                  onload={() => (imageLoading[`${variant}-show`] = false)}
                />
              {:else if $showData}
                <div
                  style="transform: scale({scale}); transform-origin: top left;"
                >
                  <ShareCard
                    media={$showData.media}
                    crew={$showData.crew}
                    ratings={$showData.ratings}
                    posterUrl={$showData.posterUrl}
                    {variant}
                  />
                </div>
              {:else}
                <div class="card-placeholder"></div>
              {/if}
            </div>
            <div class="card-url-row">
              <span class="card-url">
                {#if showImagePreview[variant]}
                  {shareableImageUrl({ type: "show", slug: showSlug, variant })}
                {/if}
              </span>
            </div>
          </figure>

          <figure class="card-figure">
            <div class="card-meta">
              <span class="media-type-badge bold" data-type="movie">Movie</span>
              <span class="media-slug">the-matrix-1999</span>
            </div>
            <div
              class="card-wrapper"
              style="width: {displayWidth}px; height: {displayHeight}px;"
            >
              {#if showImagePreview[variant]}
                {#if imageLoading[`${variant}-movie`]}
                  <div class="card-placeholder"></div>
                {/if}
                <img
                  class="card-image"
                  style={imageLoading[`${variant}-movie`] ? "display:none" : ""}
                  src={shareableImageUrl({
                    type: "movie",
                    slug: movieSlug,
                    variant,
                  })}
                  alt="Generated share card for {movieSlug}"
                  width={displayWidth}
                  height={displayHeight}
                  onload={() => (imageLoading[`${variant}-movie`] = false)}
                />
              {:else if $movieData}
                <div
                  style="transform: scale({scale}); transform-origin: top left;"
                >
                  <ShareCard
                    media={$movieData.media}
                    crew={$movieData.crew}
                    ratings={$movieData.ratings}
                    posterUrl={$movieData.posterUrl}
                    {variant}
                  />
                </div>
              {:else}
                <div class="card-placeholder"></div>
              {/if}
            </div>
            <div class="card-url-row">
              <span class="card-url">
                {#if showImagePreview[variant]}
                  {shareableImageUrl({
                    type: "movie",
                    slug: movieSlug,
                    variant,
                  })}
                {/if}
              </span>
            </div>
          </figure>
        </div>
      </section>
    {/each}
  </div>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ni-64) var(--gap-m) var(--gap-xl);
    width: 100%;
    box-sizing: border-box;
    gap: var(--gap-xl);
  }
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
    text-align: center;
    max-width: 540px;
  }

  .hero-eyebrow {
    font-size: var(--font-size-text-small);
    color: var(--purple-500);
  }

  h1 {
    color: var(--color-text-primary);
  }

  .hero-description {
    margin-top: var(--gap-xs);
    color: var(--color-text-secondary);
    max-width: 36ch;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    max-width: 1200px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    width: 100%;
    padding: var(--gap-xl) 0;

    & + section {
      margin-top: var(--gap-xl);
      padding-top: var(--gap-xl);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        inset-inline: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--color-border) 20%,
          var(--color-border) 80%,
          transparent 100%
        );
      }
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
  }

  .section-header-end {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .preview-toggle {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .preview-label {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    transition: color var(--transition-increment) ease-in-out;

    &.active {
      color: var(--color-text-primary);
    }
  }

  .section-title-row {
    display: flex;
    align-items: baseline;
    gap: var(--gap-s);
  }

  .section-index {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }

  h2 {
    color: var(--color-text-primary);
  }

  .dimension-badge {
    font-size: var(--font-size-text-small);
    color: var(--shade-300);
    background: var(--color-background-elevated, var(--shade-800));
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-s);
    padding: var(--gap-xxs) var(--gap-xs);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-l);
  }

  .card-figure {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin: 0;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .media-type-badge {
    font-size: var(--font-size-text-small);
    padding: var(--gap-xxs) var(--gap-xs);
    border-radius: var(--border-radius-s);

    &[data-type="show"] {
      color: var(--purple-300);
      background: color-mix(in srgb, var(--purple-500) 15%, transparent);
    }

    &[data-type="movie"] {
      color: var(--blue-300);
      background: color-mix(in srgb, var(--blue-500) 20%, transparent);
    }
  }

  .media-slug {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  .card-url-row {
    min-height: 1.4em;
    display: flex;
    align-items: center;
  }

  .card-url {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    opacity: 0.7;
    font-family: monospace;
    word-break: break-all;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-l);
    display: block;
  }

  .card-placeholder {
    width: 100%;
    height: 100%;
    background: var(--shade-800);
    border-radius: var(--border-radius-l);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }

    50% {
      opacity: 0.6;
    }
  }
</style>
