<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import PopcornIcon from "../icons/PopcornIcon.svelte";
  import RatingIcon from "../icons/RatingIcon.svelte";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  import RatingItem from "./RatingItem.svelte";
  import { getDisplayableRatings } from "./_internal/getDisplayableRatings";

  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
    airDate: Date;
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    airDate,
  }: RatingListProps = $props();

  const { trakt, imdb, rotten } = $derived(
    getDisplayableRatings({ ratings, airDate }),
  );
</script>

<div class="trakt-summary-ratings">
  <RatingItem rating={toPercentage(trakt.rating, languageTag())}>
    <RatingIcon style={toVotesBasedRating(trakt.votes)} />
    {#snippet superscript()}
      {i18n.voteText(trakt.votes)}
    {/snippet}
  </RatingItem>

  <RatingItem rating={imdb?.rating} url={imdb?.url}>
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(imdb?.votes ?? 0)}
    {/snippet}
  </RatingItem>

  <RatingItem rating={rotten?.critic} url={rotten?.url}>
    <RottenIcon style={toRottenCriticRating(rotten?.critic)} />
    {#snippet superscript()}
      {toRottenCriticRating(rotten?.critic ?? 0)}
    {/snippet}
  </RatingItem>

  <RatingItem rating={rotten?.audience} url={rotten?.url}>
    <PopcornIcon style={toRottenAudienceRating(rotten?.audience)} />
    {#snippet superscript()}
      {toRottenAudienceRating(rotten?.audience ?? 0)}
    {/snippet}
  </RatingItem>
</div>

<style>
  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }
</style>
