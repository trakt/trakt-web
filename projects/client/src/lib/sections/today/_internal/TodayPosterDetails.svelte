<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { TodayMedia } from "../models/TodayMedia.ts";
  import { useTodayDetails } from "../useTodayDetails.ts";

  const MAX_GENRES = 3;
  const MAX_ASPECTS = 3;

  const { media }: { media: TodayMedia } = $props();

  const { ratings, isRatingsLoading, sentiment } = useTodayDetails(
    fromRune(() => media),
  );

  const meta = $derived(
    [
      media.year,
      ...media.genres
        .slice(0, MAX_GENRES)
        .map((genre) => toTranslatedGenre(genre)),
    ]
      .filter(Boolean)
      .join(" · "),
  );

  const aspects = $derived(
    $sentiment
      ? [
          {
            key: "good" as const,
            items: $sentiment.aspect.pros.slice(0, MAX_ASPECTS),
          },
          {
            key: "bad" as const,
            items: $sentiment.aspect.cons.slice(0, MAX_ASPECTS),
          },
        ].filter((aspect) => aspect.items.length > 0)
      : [],
  );
</script>

<div class="trakt-today-poster-details">
  <div class="details-header">
    <CrossOriginImage src={media.cover.url.medium} alt="" />
    <div class="details-heading">
      <h3 class="ellipsis">{media.title}</h3>
      <p class="small secondary ellipsis">{meta}</p>
    </div>
  </div>

  <div class="details-body">
    {#if $ratings}
      <RatingList
        ratings={$ratings}
        entry={media}
        isLoading={$isRatingsLoading}
      />
    {/if}

    {#if media.overview}
      <p class="small" use:lineClamp={{ lines: 5 }}>{media.overview}</p>
    {/if}

    {#if $sentiment}
      <div class="details-sentiment">
        <p class="tag uppercase bold details-kicker">
          {m.header_community_sentiment()}
        </p>
        <p class="small" use:lineClamp={{ lines: 3 }}>
          {$sentiment.highlight}
        </p>

        {#each aspects as aspect (aspect.key)}
          <div class="details-aspects" data-sentiment={aspect.key}>
            <SentimentIcon sentiment={aspect.key} />
            <ul>
              {#each aspect.items as item, index (index)}
                <li><p class="small capitalize ellipsis">{item}</p></li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-today-poster-details {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    height: 100%;
    overflow: hidden;

    .details-header {
      position: relative;
      flex: 1 0 var(--ni-120);
      min-height: var(--ni-120);

      :global(img) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 30%,
          var(--color-card-background) 100%
        );
      }
    }

    .details-heading {
      position: absolute;
      inset-inline: var(--gap-m);
      bottom: var(--gap-xs);
      z-index: var(--layer-raised);

      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      h3 {
        margin: 0;
      }
    }

    .details-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      flex-shrink: 0;

      padding: var(--gap-s) var(--gap-m) var(--gap-m);
    }

    .details-sentiment {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      padding-top: var(--gap-s);
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }

    .details-kicker {
      color: var(--color-text-emphasis);
    }

    .details-aspects {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-xs);

      color: var(--color-sentiment-good);

      &[data-sentiment="bad"] {
        color: var(--color-sentiment-bad);
      }

      :global(svg) {
        flex-shrink: 0;
        width: var(--ni-16);
        height: var(--ni-16);
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--gap-xxs);
        min-width: 0;

        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        min-width: 0;
        color: var(--color-text-primary);
      }
    }
  }
</style>
