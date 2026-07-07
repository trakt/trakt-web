<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating.ts";

  type SeasonInfoSectionProps = {
    season: Season;
    show: ShowEntry;
  };

  const { season, show }: SeasonInfoSectionProps = $props();

  const traktRating = $derived(
    season.rating != null
      ? toTraktRating(season.rating, getLocale())
      : undefined,
  );
</script>

<div class="season-info-section">
  <div class="season-rating-row">
    {#if traktRating}
      <div class="season-rating">
        <RatingIcon style="rated" />
        <p class="bold">{traktRating}</p>
      </div>
    {/if}

    <RateNow type="season" media={season} {show} />
  </div>

  {#if season.overview}
    <ClampedText
      label={m.button_label_expand_media_overview({ title: show.title })}
      lineCount={6}
    >
      {season.overview}
    </ClampedText>
  {/if}
</div>

<style lang="scss">
  .season-info-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .season-rating-row {
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

  .season-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      height: var(--font-size-text);
      width: auto;
    }
  }
</style>
