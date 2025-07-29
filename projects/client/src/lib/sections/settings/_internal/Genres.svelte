<script lang="ts">
  import { GENRES } from "$lib/features/filters/_internal/genres";
  import * as m from "$lib/features/i18n/messages.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
  import { useSettings } from "./useSettings";

  const { genres, isSavingSettings } = useSettings();

  // FIXME: use local writable and allow for faster clicks without disabling
  const favorites = $derived($genres.favorites);

  const toggleFavoriteGenre = (genre: string) => {
    if (favorites.includes(genre)) {
      $genres.set(favorites.filter((g) => g !== genre));
      return;
    }

    $genres.set([...favorites, genre]);
  };
</script>

<SettingsBlock title={m.header_favorite_genres()}>
  <div class="trakt-genres" role="group">
    {#each GENRES as genre}
      <ToggleTag
        disabled={$isSavingSettings}
        label={m.button_label_toggle_genre({
          genre: toTranslatedValue("genre", genre),
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
    justify-content: center;

    padding: var(--ni-8);

    gap: var(--gap-xs);
  }
</style>
