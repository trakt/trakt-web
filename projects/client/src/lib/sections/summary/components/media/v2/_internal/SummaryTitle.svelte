<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import type { GenreIntl } from "$lib/components/summary/GenreIntl";
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";

  const SEPARATOR = "•";
  const GENRE_SEPARATOR = " / ";

  type MediaTitleProps = {
    title: string;
    genres: string[];
    i18n?: GenreIntl;
    year: number | Nil;
    status?: string | Nil;
    certification?: string | Nil;
  };

  const {
    title,
    genres,
    i18n = GenreIntlProvider,
    year,
    status,
    certification,
  }: MediaTitleProps = $props();

  const subtitle = $derived.by(() => {
    const subtitleParts = [];

    const visibleGenres = genres
      .slice(0, 3)
      .map(i18n.genre)
      .join(GENRE_SEPARATOR);

    year && subtitleParts.push(`${year}`);
    certification && subtitleParts.push(certification);
    subtitleParts.push(visibleGenres);

    return subtitleParts.join(` ${SEPARATOR} `);
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

  <p class="secondary smaller">
    {subtitle}
  </p>

  {#if status}
    <p class="secondary smaller meta-info trakt-media-status">
      {status}
    </p>
  {/if}
</div>

<style>
  .trakt-summary-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
      letter-spacing: -0.075rem;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-32));
    text-align: center;
  }

  .trakt-media-status {
    color: var(--color-text-emphasis);
  }
</style>
