<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import type { GenreIntl } from "$lib/components/summary/GenreIntl";
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";

  type MediaTitleProps = {
    title: string;
    genres: string[];
    i18n?: GenreIntl;
    separator?: string;
    year: number | Nil;
    status?: string | Nil;
  };

  const {
    title,
    genres,
    i18n = GenreIntlProvider,
    separator = " / ",
    year,
    status,
  }: MediaTitleProps = $props();

  const subtitle = $derived.by(() => {
    const visibleGenres = genres.slice(0, 3).map(i18n.genre).join(separator);
    if (!year) {
      return visibleGenres;
    }

    return `${year} • ${visibleGenres}`;
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
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-32));
    text-align: center;
  }

  .trakt-media-status {
    color: var(--color-text-emphasis);
  }
</style>
