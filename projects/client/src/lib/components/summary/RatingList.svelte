<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
    toRottenPercentage,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import ActionButton from "../buttons/ActionButton.svelte";
  import LetterboxdIcon from "../icons/LetterboxdIcon.svelte";
  import MALIcon from "../icons/MALIcon.svelte";
  import PopcornIcon from "../icons/PopcornIcon.svelte";
  import RatingIcon from "../icons/RatingIcon.svelte";
  import RottenIcon from "../icons/RottenIcon.svelte";
  import TMDBIcon from "../icons/TMDBIcon.svelte";
  import WatchersIcon from "../icons/WatchersIcon.svelte";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  import RatingItem from "./RatingItem.svelte";
  import { getDisplayableRatings } from "./_internal/getDisplayableRatings";

  type TraktRatingDrilldown = {
    href: string;
    noscroll: boolean;
    replacestate: boolean;
  };

  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
    entry: MediaEntry | EpisodeEntry;
    drilldown?: TraktRatingDrilldown;
    // Alternative to `drilldown`: open a locally-mounted drawer instead of
    // navigating via a URL. Used by the episode drawer, which can't route to
    // a `view=` drawer without replacing itself.
    onDrilldown?: () => void;
    variant?: "all" | "external";
    isLoading?: boolean;
    // "minimal" (the default, matching the compact summary row) drops the
    // vote-count superscripts; "default" renders them, used by the ratings
    // drawer.
    style?: "default" | "minimal";
    // "row" (default) lays sources out inline; "tile" renders each source as a
    // card in a grid, used by the ratings drawer.
    layout?: "row" | "tile";
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    entry,
    drilldown,
    onDrilldown,
    variant = "all",
    isLoading = false,
    style = "minimal",
    layout = "row",
  }: RatingListProps = $props();

  const { trakt, imdb, tmdb, rotten, mal, letterboxd } = $derived(
    getDisplayableRatings({ ratings, entry }),
  );

  const isMediaEntry = $derived(
    entry.type === "show" || entry.type === "movie",
  );

  // Letterboxd is films-only and lives only in the ratings breakdown, never the
  // compact summary row. MAL (anime-only) shows wherever externals render.
  const showLetterboxd = $derived(
    variant === "external" && entry.type === "movie" &&
      letterboxd?.rating != null,
  );

  // Reserve the MAL slot in the skeleton for anime movies/shows, so the row
  // does not shift when the (anime-only) MAL rating lands. Episodes never carry
  // a MAL rating, so they are excluded from the reserve.
  const isAnime = $derived(isMediaEntry && entry.genres.includes("anime"));
  const showMal = $derived(mal?.rating != null || (isLoading && isAnime));

  // TMDB lives only in the ratings breakdown, never the compact summary row.
  const showTmdb = $derived(variant === "external" && tmdb?.rating != null);
</script>

{#snippet voteCount(votes: number | Nil)}
  {#if layout === "tile"}
    <WatchersIcon />
  {/if}
  {i18n.voteText(votes ?? 0)}
{/snippet}

{#snippet traktItem()}
  <RatingItem
    rating={trakt?.rating && toTraktRating(trakt.rating, getLocale())}
    {isLoading}
    {style}
    {layout}
  >
    <RatingIcon style={toVotesBasedRating(trakt?.votes)} />
    {#snippet superscript()}
      {@render voteCount(trakt?.votes)}
    {/snippet}
  </RatingItem>
{/snippet}

<div class="trakt-summary-ratings" data-layout={layout}>
  {#if variant === "all"}
    {@render traktItem()}
  {/if}

  <RatingItem
    rating={imdb?.rating && toIMDBRating(imdb.rating, getLocale())}
    url={imdb?.url}
    {isLoading}
    {style}
    {layout}
  >
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {@render voteCount(imdb?.votes)}
    {/snippet}
  </RatingItem>

  {#if showMal}
    <RatingItem
      rating={mal?.rating != null
      ? toIMDBRating(mal.rating, getLocale())
      : undefined}
      url={mal?.url}
      {isLoading}
      {style}
      {layout}
    >
      <MALIcon style={toVotesBasedRating(mal?.votes ?? undefined)} />
      {#snippet superscript()}
        {@render voteCount(mal?.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if isMediaEntry}
    <RatingItem
      rating={toRottenPercentage(rotten?.critic)}
      url={rotten?.url}
      {isLoading}
      {style}
      {layout}
    >
      <RottenIcon style={toRottenCriticRating(rotten?.critic)} />
      {#snippet superscript()}
        {toRottenCriticRating(rotten?.critic ?? 0)}
      {/snippet}
    </RatingItem>

    <RatingItem
      rating={toRottenPercentage(rotten?.audience)}
      url={rotten?.url}
      {isLoading}
      {style}
      {layout}
    >
      <PopcornIcon style={toRottenAudienceRating(rotten?.audience)} />
      {#snippet superscript()}
        {toRottenAudienceRating(rotten?.audience ?? 0)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if showLetterboxd && letterboxd}
    <RatingItem
      rating={toIMDBRating(letterboxd.rating, getLocale())}
      url={letterboxd.url}
      {isLoading}
      {style}
      {layout}
    >
      <LetterboxdIcon style={toVotesBasedRating(letterboxd.votes ?? undefined)} />
      {#snippet superscript()}
        {@render voteCount(letterboxd.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if showTmdb && tmdb}
    <RatingItem
      rating={toIMDBRating(tmdb.rating, getLocale())}
      url={tmdb.url}
      {isLoading}
      {style}
      {layout}
    >
      <TMDBIcon />
      {#snippet superscript()}
        {@render voteCount(tmdb.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if onDrilldown || drilldown}
    <ActionButton
      classList="trakt-ratings-drilldown-button"
      onclick={onDrilldown}
      href={drilldown?.href}
      noscroll={drilldown?.noscroll}
      replacestate={drilldown?.replacestate}
      label={i18n.viewBreakdownLabel()}
      style="ghost"
      size="small"
    >
      <CaretRightIcon />
    </ActionButton>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    // wrap instead of shrinking items: a shrunk RatingItem clips its value and
    // vote-count under `overflow: clip`. Keeps the row intact as sources grow
    // (e.g. MAL joining for anime).
    flex-wrap: wrap;
    gap: var(--gap-s);

    :global(> rating) {
      flex: 0 0 auto;
    }

    // Tile layout: equal-column grid of source cards, matching the drawer's
    // stat-tile surfaces. Overrides the inline flex row above.
    &[data-layout="tile"] {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap-s);

      :global(> rating) {
        flex: initial;
      }
    }

    :global(.trakt-ratings-drilldown-button) {
      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }
  }
</style>
