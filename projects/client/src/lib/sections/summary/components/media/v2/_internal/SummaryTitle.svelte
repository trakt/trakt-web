<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import type { GenreIntl } from "$lib/components/summary/GenreIntl";
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaStatus } from "$lib/requests/models/MediaStatus";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const SEPARATOR = "•";

  type MediaTitleProps = {
    title: string;
    genres: string[];
    i18n?: GenreIntl;
    year: number | Nil;
    status?: MediaStatus | Nil;
    certification?: string | Nil;
    type: ExtendedMediaType;
    crew: MediaCrew;
  };

  const {
    title,
    genres,
    i18n = GenreIntlProvider,
    year,
    status,
    certification,
    type,
    crew,
  }: MediaTitleProps = $props();

  const subtitle = $derived.by(() => {
    const subtitleParts = [];

    const genre = genres.at(0);
    const genreText = genre && i18n.genre(genre);

    year && subtitleParts.push(`${year}`);
    certification && subtitleParts.push(certification);
    genreText && subtitleParts.push(genreText);

    return subtitleParts.join(` ${SEPARATOR} `);
  });

  const mainCredit = $derived.by(() => {
    if (type === "show") {
      const creator = crew.creators?.at(0);
      return (
        creator && {
          text: m.text_created_by({ name: creator.name }),
          key: creator.key,
        }
      );
    }

    const director = crew.directors?.at(0);
    return (
      director && {
        text: m.text_directed_by({ name: director.name }),
        key: director.key,
      }
    );
  });
</script>

<div class="trakt-summary-title">
  <h2
    data-testid={TestId.SummaryMediaTitle}
    class:short-title={title.length < 15}
    class:long-title={title.length > 25}
  >
    {title}
  </h2>

  {#if mainCredit}
    <p class="tiny trakt-media-main-credit">
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key)}
        target="_self"
      />
    </p>
  {/if}

  <p class="secondary smaller">
    {subtitle}
  </p>

  {#if status}
    <p class="capitalize meta-info trakt-media-status">
      {toTranslatedStatus(status)}
    </p>
  {/if}
</div>

<style>
  .trakt-summary-title {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-micro);
  }

  h2 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-32));
    text-align: center;
  }

  .trakt-media-status {
    color: var(--color-text-emphasis);
  }

  .trakt-media-main-credit {
    :global(.trakt-link) {
      text-decoration-thickness: var(--ni-1);
    }
  }
</style>
