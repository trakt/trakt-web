<script lang="ts">
  import { GENRES } from "$lib/features/filters/_internal/genres";
  import * as m from "$lib/features/i18n/messages.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import type { Genre } from "@trakt/api";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import { useSettings } from "./useSettings";

  const genreLimit = 5;

  const { genres, isSavingSettings } = useSettings();

  // FIXME: use local writable and allow for faster clicks without disabling
  const favorites = $derived($genres.favorites);
  const isAtLimit = $derived(favorites.length >= genreLimit);

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

<SettingsSectionLabel title={m.header_favorite_genres()} />

<SettingsGroupCard>
  <div class="genre-picker-row">
    <p class="small secondary">
      {m.description_genres({ limit: genreLimit })}
    </p>
    <div class="trakt-genres">
      {#each GENRES as genre (genre)}
        <ToggleTag
          label={m.button_label_toggle_genre({
            genre: toTranslatedGenre(genre),
          })}
          isPressed={favorites.includes(genre)}
          disabled={!isGenreSelectable(genre)}
          onclick={() => toggleFavoriteGenre(genre)}
          >{toTranslatedGenre(genre)}</ToggleTag
        >
      {/each}
    </div>
  </div>
</SettingsGroupCard>

<style>
  .genre-picker-row {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding: var(--gap-m);
  }

  .trakt-genres {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }
</style>
