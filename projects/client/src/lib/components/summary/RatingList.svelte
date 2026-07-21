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
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    entry,
    drilldown,
    onDrilldown,
    variant = "all",
    isLoading = false,
  }: RatingListProps = $props();

  const { trakt, imdb, rotten, mal, letterboxd } = $derived(
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
</script>

{#snippet traktItem()}
  <RatingItem
    rating={trakt?.rating && toTraktRating(trakt.rating, getLocale())}
    {isLoading}
  >
    <RatingIcon style={toVotesBasedRating(trakt?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(trakt?.votes ?? 0)}
    {/snippet}
  </RatingItem>
{/snippet}

<div class="trakt-summary-ratings">
  {#if variant === "all"}
    {@render traktItem()}
  {/if}

  <RatingItem
    rating={imdb?.rating && toIMDBRating(imdb.rating, getLocale())}
    url={imdb?.url}
    {isLoading}
  >
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(imdb?.votes ?? 0)}
    {/snippet}
  </RatingItem>

  {#if showMal}
    <RatingItem
      rating={mal?.rating != null
      ? toIMDBRating(mal.rating, getLocale())
      : undefined}
      url={mal?.url}
      {isLoading}
    >
      <MALIcon style={toVotesBasedRating(mal?.votes ?? undefined)} />
      {#snippet superscript()}
        {i18n.voteText(mal?.votes ?? 0)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if isMediaEntry}
    <RatingItem
      rating={toRottenPercentage(rotten?.critic)}
      url={rotten?.url}
      {isLoading}
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
    >
      <LetterboxdIcon style={toVotesBasedRating(letterboxd.votes ?? undefined)} />
      {#snippet superscript()}
        {i18n.voteText(letterboxd.votes ?? 0)}
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

    :global(.trakt-ratings-drilldown-button) {
      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    @include for-mobile() {
      gap: var(--gap-xxs);
    }
  }
</style>
