<script lang="ts">
  import ActionIcon from "$lib/components/icons/ActionIcon.svelte";
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
</script>

<div class="trakt-summary-genre">
  <ActionIcon />
  {#each genres as genre}
    <span class="trakt-genre capitalize">{i18n.genre(genre)}</span>
    {#if genre !== genres.at(-1)}
      <span>{separator}</span>
    {/if}
  {/each}
</div>

<style>
  .trakt-summary-genre {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }
</style>
