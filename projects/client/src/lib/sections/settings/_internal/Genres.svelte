<script lang="ts">
  import CaretRightIcon from '$lib/components/icons/CaretRightIcon.svelte';
  import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
  import * as m from '$lib/features/i18n/messages';
  import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre';
  import type { Genre } from '@trakt/api';
  import GenresDrawer from './GenresDrawer.svelte';
  import SettingsGroupCard from './SettingsGroupCard.svelte';
  import SettingsSectionLabel from './SettingsSectionLabel.svelte';
  import { useSettings } from './useSettings';
  import StreamingServiceBadge from './streaming-services/StreamingServiceBadge.svelte';

  const genreLimit = 5;

  const { genres, isSavingSettings, setLovedGenres, setHatedGenres } =
    useSettings();

  let openDrawer: 'loved' | 'hated' | null = $state(null);

  const isSaving = $derived($isSavingSettings);
  const loved = $derived($genres.loved);
  const hated = $derived($genres.hated);

  function emptySlots(filled: Genre[]): number[] {
    return Array.from({ length: genreLimit - filled.length }, (_, i) => i);
  }
</script>

{#snippet genreSection(
  title: string,
  editLabel: string,
  list: 'loved' | 'hated',
  selected: Genre[],
)}
  <SettingsSectionLabel {title} />
  <SettingsGroupCard>
    <div class="trakt-genre-section">
      <div class="slots-row">
        {#each selected as genre (genre)}
          <div class="genre-slot" data-genre={genre}>
            <StreamingServiceBadge name={toTranslatedGenre(genre)} />
          </div>
        {/each}
        {#each emptySlots(selected) as i (i)}
          <div class="genre-slot is-empty" aria-hidden="true">
            <PlusIcon />
          </div>
        {/each}
      </div>
      <button
        class="edit-button"
        type="button"
        aria-label={editLabel}
        disabled={isSaving}
        onclick={() => (openDrawer = list)}
      >
        <CaretRightIcon />
      </button>
    </div>
  </SettingsGroupCard>
{/snippet}

{@render genreSection(
  m.header_genres_loved(),
  m.button_label_edit_loved_genres(),
  'loved',
  loved,
)}

{@render genreSection(
  m.header_genres_hated(),
  m.button_label_edit_hated_genres(),
  'hated',
  hated,
)}

{#if openDrawer === 'loved'}
  <GenresDrawer
    title={m.header_genres_loved()}
    current={loved}
    other={hated}
    onSave={setLovedGenres}
    onClose={() => (openDrawer = null)}
  />
{:else if openDrawer === 'hated'}
  <GenresDrawer
    title={m.header_genres_hated()}
    current={hated}
    other={loved}
    onSave={setHatedGenres}
    onClose={() => (openDrawer = null)}
  />
{/if}

<style lang="scss">
  @use '$style/scss/mixins/index' as *;

  .trakt-genre-section {
    --genre-tile-size: 70px;

    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
  }

  .slots-row {
    display: flex;
    gap: var(--gap-s);
    flex: 1;
    align-items: center;
    min-width: 0;
    overflow: hidden;
  }

  .genre-slot {
    width: var(--genre-tile-size);
    height: var(--genre-tile-size);
    flex-shrink: 0;

    :global(.trakt-streaming-service-badge) {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
    }
  }

  .genre-slot.is-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) dashed
      color-mix(in srgb, var(--color-foreground) 20%, transparent);
    color: color-mix(in srgb, var(--color-foreground) 30%, transparent);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .edit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: var(--gap-xs);
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    border-radius: var(--border-radius-s);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    &:disabled {
      opacity: var(--de-emphasized-opacity);
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      color: var(--color-text-primary);
    }
  }

  /* Genre-specific gradient backgrounds */
  .genre-slot[data-genre='action'] {
    --badge-background: linear-gradient(135deg, var(--red-700), var(--red-900));
  }
  .genre-slot[data-genre='adventure'] {
    --badge-background: linear-gradient(135deg, var(--blue-500), var(--blue-800));
  }
  .genre-slot[data-genre='animation'] {
    --badge-background: linear-gradient(135deg, var(--purple-500), var(--purple-800));
  }
  .genre-slot[data-genre='anime'] {
    --badge-background: linear-gradient(135deg, var(--purple-400), var(--purple-700));
  }
  .genre-slot[data-genre='biography'] {
    --badge-background: linear-gradient(135deg, var(--shade-400), var(--shade-700));
  }
  .genre-slot[data-genre='children'] {
    --badge-background: linear-gradient(135deg, var(--yellow-400), var(--orange-500));
  }
  .genre-slot[data-genre='comedy'] {
    --badge-background: linear-gradient(135deg, var(--yellow-500), var(--yellow-700));
  }
  .genre-slot[data-genre='crime'] {
    --badge-background: linear-gradient(135deg, var(--shade-600), var(--shade-900));
  }
  .genre-slot[data-genre='documentary'] {
    --badge-background: linear-gradient(135deg, var(--green-500), var(--green-800));
  }
  .genre-slot[data-genre='drama'] {
    --badge-background: linear-gradient(135deg, var(--purple-600), var(--purple-900));
  }
  .genre-slot[data-genre='family'] {
    --badge-background: linear-gradient(135deg, var(--orange-400), var(--orange-700));
  }
  .genre-slot[data-genre='fantasy'] {
    --badge-background: linear-gradient(135deg, var(--blue-600), var(--purple-700));
  }
  .genre-slot[data-genre='history'] {
    --badge-background: linear-gradient(135deg, var(--orange-600), var(--red-800));
  }
  .genre-slot[data-genre='holiday'] {
    --badge-background: linear-gradient(135deg, var(--green-400), var(--green-700));
  }
  .genre-slot[data-genre='horror'] {
    --badge-background: linear-gradient(135deg, var(--red-800), var(--shade-900));
  }
  .genre-slot[data-genre='musical'] {
    --badge-background: linear-gradient(135deg, var(--purple-500), var(--blue-700));
  }
  .genre-slot[data-genre='mystery'] {
    --badge-background: linear-gradient(135deg, var(--blue-700), var(--shade-800));
  }
  .genre-slot[data-genre='romance'] {
    --badge-background: linear-gradient(135deg, var(--red-500), var(--red-800));
  }
  .genre-slot[data-genre='science-fiction'] {
    --badge-background: linear-gradient(135deg, var(--blue-500), var(--blue-900));
  }
  .genre-slot[data-genre='superhero'] {
    --badge-background: linear-gradient(135deg, var(--blue-600), var(--red-700));
  }
  .genre-slot[data-genre='suspense'] {
    --badge-background: linear-gradient(135deg, var(--purple-700), var(--shade-900));
  }
  .genre-slot[data-genre='thriller'] {
    --badge-background: linear-gradient(135deg, var(--shade-700), var(--shade-900));
  }
  .genre-slot[data-genre='war'] {
    --badge-background: linear-gradient(135deg, var(--yellow-700), var(--shade-800));
  }
  .genre-slot[data-genre='western'] {
    --badge-background: linear-gradient(135deg, var(--orange-700), var(--red-900));
  }
</style>
