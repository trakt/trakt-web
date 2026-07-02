<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating.ts";

  type SeasonInfoSectionProps = {
    season: Season;
    showTitle: string;
  };

  const { season, showTitle }: SeasonInfoSectionProps = $props();

  const traktRating = $derived(
    season.rating != null
      ? toTraktRating(season.rating, getLocale())
      : undefined,
  );
</script>

<div class="season-info-section">
  {#if traktRating}
    <div class="season-rating">
      <RatingIcon style="rated" />
      <p class="bold">{traktRating}</p>
    </div>
  {/if}

  {#if season.overview}
    <ClampedText
      label={m.button_label_expand_media_overview({ title: showTitle })}
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
