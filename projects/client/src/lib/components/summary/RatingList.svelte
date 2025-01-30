<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import { toRottenTomatoRating } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
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
  <RatingItem voteCount={trakt.votes}>
    <RatingIcon style={toVotesBasedRating(trakt.votes)} />
    {#snippet rating()}
      {toPercentage(trakt.rating, languageTag())}
    {/snippet}
    {#snippet superscript()}
      {i18n.voteText(trakt.votes)}
    {/snippet}
  </RatingItem>

  <RatingItem voteCount={imdb.votes}>
    <IMDBIcon style={toVotesBasedRating(imdb.votes)} />
    {#snippet rating()}
      {imdb.rating}
    {/snippet}
    {#snippet superscript()}
      {i18n.voteText(imdb.votes)}
    {/snippet}
  </RatingItem>

  <RatingItem voteCount={rotten.critic}>
    <RottenIcon style={toRottenTomatoRating(rotten.critic)} />
    {#snippet rating()}
      {rotten.critic}
    {/snippet}
    {#snippet superscript()}
      {toRottenTomatoRating(rotten.critic)}
    {/snippet}
  </RatingItem>
</div>

<style>
  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
