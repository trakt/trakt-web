<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import AirTimeTag from "$lib/components/media/tags/AirTimeTag.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { CalendarItem } from "./useCalendar";

  const { item }: { item: CalendarItem } = $props();

  const tile = $derived(
    "show" in item
      ? {
          href: UrlBuilder.episodeDrawer(item.show.slug, item.season, item.number),
          poster: item.show.poster.url.medium,
          title: item.show.title,
          subtitle: episodeNumberLabel({
            seasonNumber: item.season,
            episodeNumber: item.number,
          }),
          airDate: item.airDate,
        }
      : {
          href: UrlBuilder.movie(item.slug),
          poster: item.poster.url.medium,
          title: item.title,
          subtitle: toTranslatedType(item.type),
          airDate: null,
        },
  );
</script>

<div class="trakt-calendar-poster-tile">
  <Link href={tile.href} color="inherit">
    <div class="tile-poster">
      <CrossOriginImage
        classList="tile-poster-image"
        animate={false}
        src={tile.poster}
        alt={tile.title}
      />
      <div class="tile-overlay">
        {#if tile.airDate}
          <AirTimeTag airDate={tile.airDate} />
        {/if}
        {#if "show" in item}
          <EpisodeStatusTag
            i18n={EpisodeIntlProvider}
            episodeType={item.type}
            episodes={item.episodes}
            releaseDate={item.effectiveReleaseDate}
            type="tag"
          />
        {/if}
      </div>
    </div>
    <span class="tile-title bold ellipsis">{tile.title}</span>
    <span class="tile-subtitle secondary ellipsis">
      <bdi dir="ltr">{tile.subtitle}</bdi>
    </span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-poster-tile {
    min-width: 0;

    :global(.trakt-link) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      text-decoration: none;
    }

    .tile-poster {
      position: relative;
      overflow: hidden;

      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-m);

      background-color: var(--color-calendar-inactive-background);
      box-shadow: var(--shadow-raised);

      transition: var(--transition-increment) ease-in-out;
      transition-property: transform, box-shadow;

      :global(.tile-poster-image) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .tile-overlay {
      position: absolute;
      inset-inline: 0;
      bottom: 0;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-micro);

      padding: var(--gap-xs);
      padding-top: var(--ni-32);

      background: linear-gradient(
        to bottom,
        transparent,
        color-mix(in srgb, var(--shade-1000) 85%, transparent)
      );

      :global(.trakt-tag) {
        background: var(--color-background-cover-tag);
      }
    }


    .tile-title {
      margin-top: var(--gap-xxs);
      font-size: var(--font-size-text);
    }

    .tile-subtitle {
      font-size: var(--font-size-tag);
    }

    @include for-mouse {
      &:hover .tile-poster {
        transform: translateY(calc(-1 * var(--ni-2)));
        box-shadow: var(--shadow-floating);
      }
    }

    &:has(:focus-visible) .tile-poster {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }
</style>
