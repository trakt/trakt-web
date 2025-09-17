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
  };

  const {
    title,
    genres,
    i18n = GenreIntlProvider,
    separator = " / ",
    year,
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
  <h2 data-testid={TestId.SummaryMediaTitle}>
    {title}
  </h2>

  <p class="secondary smaller">
    {subtitle}
  </p>
</div>

<style>
  .trakt-summary-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: var(--ni-32);
    text-align: center;
  }
</style>
