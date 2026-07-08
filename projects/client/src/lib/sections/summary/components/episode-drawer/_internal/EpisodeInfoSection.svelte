<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating.ts";

  type EpisodeInfoSectionProps = {
    episode: EpisodeEntry;
    show: ShowEntry;
  };

  const { episode, show }: EpisodeInfoSectionProps = $props();

  const traktRating = $derived(
    episode.rating != null
      ? toTraktRating(episode.rating, getLocale())
      : undefined,
  );
</script>

<div class="episode-info-section">
  <div class="episode-rating-row">
    {#if traktRating}
      <div class="episode-rating">
        <RatingIcon style="rated" />
        <p class="bold">{traktRating}</p>
      </div>
    {/if}

    <RateNow type="episode" media={episode} {show} />
  </div>

  {#if episode.overview}
    <ClampedText
      label={m.button_label_expand_media_overview({ title: show.title })}
      lineCount={6}
    >
      {episode.overview}
    </ClampedText>
  {/if}
</div>

<style lang="scss">
  .episode-info-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .episode-rating-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--gap-m);
    min-height: var(--ni-40);

    :global(.trakt-rate-now) {
      margin-inline-start: auto;
    }
  }

  .episode-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      height: var(--font-size-text);
      width: auto;
    }
  }
</style>
