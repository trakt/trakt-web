<script lang="ts">
  import ActionIcon from "$lib/components/icons/ActionIcon.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { GenreIntl } from "./GenreIntl";
  import { GenreIntlProvider } from "./GenreIntlProvider";

  type GenreListProps = {
    i18n?: GenreIntl;
    genres: string[];
    separator?: string;
  };
  const {
    i18n = GenreIntlProvider,
    genres,
    separator = "/",
  }: GenreListProps = $props();

  const isLargeDisplay = useMedia(WellKnownMediaQuery.desktop);
  const genreCount = $derived($isLargeDisplay ? undefined : 3);
  const visibleGenre = $derived(genres.slice(0, genreCount));
</script>

<div class="trakt-summary-genre">
  <ActionIcon />
  {#each visibleGenre as genre}
    <span class="trakt-genre capitalize">{i18n.genre(genre)}</span>
    {#if genre !== visibleGenre.at(-1)}
      <span>{separator}</span>
    {/if}
  {/each}
</div>

<style>
  .trakt-summary-genre {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
