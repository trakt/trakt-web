<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import type { MediaRating } from "$lib/models/MediaRating";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import { toRottenTomatoRating } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  import RatingItem from "./RatingItem.svelte";

  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
  };

  const { i18n = RatingIntlProvider, ratings }: RatingListProps = $props();
  const { imdb, tmdb, rotten, metacritic } = ratings;
</script>

<div class="trakt-third-party-ratings">
  <RatingItem voteCount={imdb.votes}>
    <IMDBIcon style={toVotesBasedRating(imdb.votes)} />
    {#snippet rating()}
      {imdb.rating}
    {/snippet}
    {#snippet superscript()}
      {i18n.voteText(imdb.votes)}
    {/snippet}
  </RatingItem>

  <RatingItem voteCount={tmdb.votes}>
    <TMDBIcon style={toVotesBasedRating(tmdb.votes)} />
    {#snippet rating()}
      {toPercentage(tmdb.rating)}
    {/snippet}
    {#snippet superscript()}
      {i18n.voteText(tmdb.votes)}
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
  .trakt-third-party-ratings {
    display: flex;
    justify-content: space-between;
    gap: var(--ni-8);
  }
</style>
