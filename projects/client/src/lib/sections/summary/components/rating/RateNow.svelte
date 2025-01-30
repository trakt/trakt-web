<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import RateActionButton from "./_internal/RateActionButton.svelte";
  import { useRatings } from "./useRatings";

  type RateableEpisode = {
    type: "episode";
    media: EpisodeEntry;
    show: MediaEntry;
    episode: EpisodeEntry;
  };

  type RateableMovie = {
    type: "movie";
    media: MediaEntry;
  };

  type RateNowProps = RateableEpisode | RateableMovie;

  const { ...props }: RateNowProps = $props();

  const { isWatched } = $derived(useIsWatched(props));

  const type = $derived(props.type);
  const id = $derived(props.media.id);

  const { isRating, isFavorited, currentRating, addRating } = $derived(
    useRatings({
      type,
      id,
    }),
  );
</script>

{#if $isWatched}
  <div class="trakt-rate-now">
    <h6>{m.rate_now()}</h6>
    <div class="trakt-rate-actions">
      {#each Object.values(SimpleRating) as simpleRating}
        <RateActionButton
          rating={simpleRating}
          isCurrentRating={$currentRating === simpleRating}
          isDisabled={$isRating}
          onAddRating={(rating: SimpleRating) => {
            if ($currentRating === rating) {
              return;
            }
            addRating(rating, $isFavorited);
          }}
        />
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rate-now {
    h6 {
      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }

    @include for-mobile {
      h6 {
        font-size: var(--ni-12);
      }
    }
  }
  .trakt-rate-now,
  .trakt-rate-actions {
    display: flex;
    align-items: center;
  }

  .trakt-rate-now {
    gap: var(--gap-m);
  }

  .trakt-rate-actions {
    gap: var(--gap-xs);
  }
</style>
