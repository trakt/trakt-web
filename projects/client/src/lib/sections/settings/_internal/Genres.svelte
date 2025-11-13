<script lang="ts">
  import { GENRES } from "$lib/features/filters/_internal/genres";
  import * as m from "$lib/features/i18n/messages.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import type { Genre } from "@trakt/api";
  import SettingsBlock from "./SettingsBlock.svelte";
  import { useSettings } from "./useSettings";

  const GENRE_LIMIT = 5;

  const { genres, isSavingSettings } = useSettings();

  // FIXME: use local writable and allow for faster clicks without disabling
  const favorites = $derived($genres.favorites);
  const isAtLimit = $derived(favorites.length >= GENRE_LIMIT);

  const toggleFavoriteGenre = (genre: string) => {
    if (favorites.includes(genre)) {
      $genres.set(favorites.filter((g) => g !== genre));
      return;
    }

    $genres.set([...favorites, genre]);
  };

  const isGenreSelectable = (genre: Genre) => {
    if ($isSavingSettings) {
      return false;
    }

    return favorites.includes(genre) || !isAtLimit;
  };
</script>

<SettingsBlock
  title={m.header_favorite_genres()}
  description={m.description_genres({ limit: GENRE_LIMIT })}
>
  <div class="trakt-genres" role="group">
    {#each GENRES as genre}
      <ToggleTag
        disabled={!isGenreSelectable(genre)}
        label={m.button_label_toggle_genre({
          genre: toTranslatedGenre(genre),
        })}
        onclick={() => toggleFavoriteGenre(genre)}
        isPressed={favorites.includes(genre)}
      >
        {genre}
      </ToggleTag>
    {/each}
  </div>
</SettingsBlock>

<style>
  .trakt-genres {
    display: flex;
    flex-wrap: wrap;

    gap: var(--gap-xs);
  }
</style>
