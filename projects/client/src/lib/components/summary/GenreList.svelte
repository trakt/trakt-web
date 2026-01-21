<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import type { GenreIntl } from "./GenreIntl";
  import { GenreIntlProvider } from "./GenreIntlProvider";

  type GenreListProps = {
    i18n?: GenreIntl;
    genres: string[];
    separator?: string;
    classList?: string;
  };
  const {
    i18n = GenreIntlProvider,
    genres,
    separator = " / ",
    classList = "",
  }: GenreListProps = $props();

  const visibleGenre = $derived(genres.slice(0, 1));
</script>

<p class="trakt-summary-genre ellipsis" use:appendClassList={classList}>
  {visibleGenre.map(i18n.genre).join(separator)}
</p>
