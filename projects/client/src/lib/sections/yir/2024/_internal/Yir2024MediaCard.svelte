<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  type Yir2024MediaCardProps = {
    item: YirWatchedItem;
    playLabel: string;
    year: number;
  };

  const { item, playLabel, year }: Yir2024MediaCardProps = $props();

  const itemUrl = $derived(UrlBuilder.media(item.entry.type, item.entry.slug));

  const watchedDate = $derived(toHumanLongDate(item.watchedAt, languageTag()));
  const watchedTime = $derived(toHumanClockTime(item.watchedAt, languageTag()));

  const episodeCode = $derived(
    item.type === "episode"
      ? episodeNumberLabel({
        seasonNumber: item.episode.season,
        episodeNumber: item.episode.number,
      })
      : null,
  );
</script>

<article class="yir-2024-media-card">
  <div class="yir-2024-media-cover">
    <CrossOriginImage src={item.entry.cover.url.medium} alt="" />
  </div>

  <div class="yir-2024-media-shade"></div>

  <div class="yir-2024-content">
    <!-- Two stat pairs mirroring the most-watched cards: "First/Last Play"
         over its "of {year}" label, and the watched date over its time. -->
    <div class="yir-2024-media-stats">
      <div class="yir-2024-media-stat">
        <span class="bold yir-2024-media-stat-value">{playLabel}</span>
        <span class="bold uppercase yir-2024-media-stat-label">
          {m.yir_2024_play_of_year({ year })}
        </span>
      </div>
      <div class="yir-2024-media-stat">
        <span class="bold yir-2024-media-stat-value">{watchedDate}</span>
        <span class="bold uppercase yir-2024-media-stat-label">
          {watchedTime}
        </span>
      </div>
    </div>

    <Link href={itemUrl} color="inherit">
      <span class="yir-2024-titles">
        <h2 class="bold yir-2024-media-title">{item.entry.title}</h2>
        {#if item.type === "episode"}
          <p class="yir-2024-media-episode">
            <span class="bold yir-2024-media-episode-code">{episodeCode}</span>
            <span class="yir-2024-media-episode-title"
            >{item.episode.title}</span>
          </p>
        {/if}
      </span>
    </Link>
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-media-card {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    min-height: var(--ni-380);
    max-height: var(--ni-640);
    border-radius: var(--border-radius-xxl);
    overflow: hidden;
    color: var(--shade-10);
    display: flex;
    align-items: flex-end;

    @include for-mobile {
      min-height: 0;
      border-radius: var(--border-radius-xl);
    }
  }

  .yir-2024-media-cover {
    position: absolute;
    inset: 0;
    z-index: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .yir-2024-media-shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--purple-700) 95%, var(--shade-1000)) 0%,
      color-mix(in srgb, var(--purple-700) 80%, transparent) 28%,
      color-mix(in srgb, var(--purple-700) 45%, transparent) 50%,
      color-mix(in srgb, var(--purple-700) 15%, transparent) 70%,
      transparent 90%
    );
  }

  // Rows top → bottom:
  //   1. Two stat pairs ("First/Last Play" + "of {year}", date + time),
  //      styled like the most-watched cards.
  //   2. Title (huge)
  //   3. Episode "S1 • E2" + title (only when episode)
  .yir-2024-content {
    position: relative;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
    padding: var(--ni-44) var(--ni-52);
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @include for-tablet-sm-and-below {
      padding: var(--ni-32);
    }

    @include for-mobile {
      padding: var(--ni-20);
    }
  }

  // Stat pairs laid out in a row — same visual language as
  // Yir2024MostPlayedCard's stats: bold value over a small uppercase muted
  // label.
  .yir-2024-media-stats {
    display: flex;
    gap: var(--ni-32);

    @include for-mobile {
      gap: var(--ni-16);
    }
  }

  .yir-2024-media-stat {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .yir-2024-media-stat-value {
    font-size: var(--ni-22);
    color: var(--shade-10);

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .yir-2024-media-stat-label {
    font-size: var(--font-size-text);
    color: var(--shade-300);

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  // Strip the inherited Link decoration and color so the title block
  // visually reads as plain text but stays clickable.
  :global(.yir-2024-content > .trakt-link) {
    text-decoration: none;
    color: inherit;
  }

  .yir-2024-titles {
    display: block;
    margin-top: var(--ni-32);

    @include for-mobile {
      margin-top: var(--ni-20);
    }
  }

  .yir-2024-media-title {
    margin: 0;
    font-size: clamp(var(--ni-28), 4vw, var(--ni-52));
  }

  // Episode sub-line: code reads as the emphasis, the title sits back in a
  // muted gray — smaller and calmer than the headline title above it.
  .yir-2024-media-episode {
    margin-top: var(--ni-8);
    font-size: var(--ni-20);
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-xs);

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .yir-2024-media-episode-code {
    color: var(--shade-10);
  }

  .yir-2024-media-episode-title {
    color: var(--shade-300);
  }
</style>
