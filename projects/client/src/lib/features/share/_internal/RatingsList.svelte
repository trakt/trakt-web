<svelte:options css="injected" />

<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import PopcornIcon from "$lib/components/icons/PopcornIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";

  const { ratings }: { ratings: MediaRating } = $props();

  const { trakt, imdb, rotten } = $derived(ratings);

  const traktRating = $derived(
    trakt?.rating ? toTraktRating(trakt.rating, "en") : undefined,
  );
  const imdbRating = $derived(imdb?.rating);
  const rottenCriticRating = $derived(
    rotten?.critic ? toTraktRating(rotten.critic, "en") : undefined,
  );
  const rottenAudienceRating = $derived(
    rotten?.audience ? toTraktRating(rotten.audience, "en") : undefined,
  );
</script>

<div class="trakt-ratings-list">
  {#if traktRating}
    <div class="trakt-rating-item trakt-rating">
      <StarIcon
        fill={toVotesBasedRating(trakt?.votes) === "rated" ? "full" : "none"}
      />
      <span>{traktRating}</span>
    </div>
  {/if}

  {#if imdbRating}
    <div class="trakt-rating-item imdb-rating">
      <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
      <span>{imdbRating}</span>
    </div>
  {/if}

  {#if rottenCriticRating}
    <div class="trakt-rating-item">
      <RottenIcon style={toRottenCriticRating(rotten?.critic)} />
      <span>{rottenCriticRating}</span>
    </div>
  {/if}

  {#if rottenAudienceRating}
    <div class="trakt-rating-item">
      <PopcornIcon style={toRottenAudienceRating(rotten?.audience)} />
      <span>{rottenAudienceRating}</span>
    </div>
  {/if}
</div>

<style>
  .trakt-ratings-list {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .trakt-rating-item {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #efefef;
    font-size: 26px;
    font-weight: bold;

    :global(svg) {
      width: 26px;
      height: 26px;
    }
  }

  .trakt-rating {
    :global(svg) {
      color: #9f42c6;
    }
  }

  .imdb-rating {
    :global(svg) {
      width: 52px;
    }
  }
</style>
