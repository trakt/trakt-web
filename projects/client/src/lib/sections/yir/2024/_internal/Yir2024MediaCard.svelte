<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    item,
    headerLabel,
  }: {
    item: YirWatchedItem;
    headerLabel: string;
  } = $props();

  const itemUrl = $derived(UrlBuilder.media(item.entry.type, item.entry.slug));

  const formattedDate = $derived(
    `${toHumanLongDate(item.watchedAt, languageTag())} ${
      toHumanClockTime(item.watchedAt, languageTag())
    }`,
  );

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
    <div class="yir-2024-play-callout">
      <span class="yir-2024-play-icon"><PlayIcon /></span>
      <span class="bold yir-2024-play-label">{headerLabel}</span>
    </div>

    <p class="yir-2024-watched-at">
      <span class="yir-2024-watched-at-icon"><ClockIcon /></span>
      <span>{formattedDate}</span>
    </p>

    <Link href={itemUrl} color="inherit">
      <span class="yir-2024-titles">
        <h2 class="bold yir-2024-media-title">{item.entry.title}</h2>
        {#if item.type === "episode"}
          <p class="yir-2024-media-episode">
            <span class="bold">{episodeCode}</span>
            <span>&ldquo;{item.episode.title}&rdquo;</span>
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
  //   1. ▷ + "First/Last play of {year}" callout
  //   2. Watched-at date with clock icon
  //   3. Title (huge)
  //   4. Episode "S1 • E2" + quoted title (only when episode)
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

  // Both rows share icon size + gap + font-size so the icons line up
  // vertically and the text after each icon starts at the same x.
  .yir-2024-play-callout,
  .yir-2024-watched-at {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-xs);
    font-size: var(--ni-16);
    color: var(--shade-10);
  }

  .yir-2024-play-icon,
  .yir-2024-watched-at-icon {
    display: inline-flex;
    align-items: center;
    color: var(--shade-10);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .yir-2024-play-label {
    text-transform: uppercase;
  }

  .yir-2024-watched-at {
    margin-top: var(--ni-6);
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

  .yir-2024-media-episode {
    margin-top: var(--ni-2);
    font-size: var(--ni-28);
    color: var(--shade-10);
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-xs);

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }
</style>
