<script lang="ts">
  import { GENRES } from "$lib/features/filters/_internal/genres.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import type { Genre } from "@trakt/api";
  import { GENRE_LIMIT } from "./constants.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import { useSettings } from "./useSettings.ts";

  const { genres, isSavingSettings, setLovedGenres } = useSettings();

  // FIXME: use local writable and allow for faster clicks without disabling
  const loved = $derived($genres?.loved ?? []);
  const isAtLimit = $derived(loved.length >= GENRE_LIMIT);

  const toggleGenre = (genre: Genre) => {
    if (loved.includes(genre)) {
      setLovedGenres(loved.filter((selected) => selected !== genre));
      return;
    }

    setLovedGenres([...loved, genre]);
  };

  const isGenreSelectable = (genre: Genre) => {
    if ($isSavingSettings) {
      return false;
    }

    return loved.includes(genre) || !isAtLimit;
  };
</script>

<SettingsGroupCard title={m.header_favorite_genres()}>
  <div class="genre-picker-row">
    <p class="small secondary">
      {m.description_genres({ limit: GENRE_LIMIT })}
    </p>
    <div class="trakt-genres">
      {#each GENRES as genre (genre)}
        <ToggleTag
          label={m.button_label_toggle_genre({
            genre: toTranslatedGenre(genre),
          })}
          isPressed={loved.includes(genre)}
          disabled={!isGenreSelectable(genre)}
          onclick={() => toggleGenre(genre)}
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
