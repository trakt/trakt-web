<script lang="ts">
  import CaretRightIcon from '$lib/components/icons/CaretRightIcon.svelte';
  import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
  import * as m from '$lib/features/i18n/messages';
  import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre';
  import { genreIcons } from '$lib/components/icons/genres/genreIcons.ts';
  import type { Genre } from '@trakt/api';
  import GenresDrawer from './GenresDrawer.svelte';
  import SettingsGroupCard from './SettingsGroupCard.svelte';
  import SettingsSectionLabel from './SettingsSectionLabel.svelte';
  import { useSettings } from './useSettings';

  const genreLimit = 5;

  const { genres, isSavingSettings, setLovedGenres, setHatedGenres } =
    useSettings();

  let openDrawer: 'loved' | 'hated' | null = $state(null);

  const isSaving = $derived($isSavingSettings);
  const loved = $derived($genres?.loved ?? []);
  const hated = $derived($genres?.hated ?? []);

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
    <button
      class="trakt-genre-section"
      type="button"
      aria-label={editLabel}
      disabled={isSaving}
      onclick={() => (openDrawer = list)}
    >
      <div class="slots-row">
        {#each selected as genre (genre)}
          <div class="genre-slot" data-genre={genre}>
            {@html genreIcons[genre]}
            <span class="genre-name">{toTranslatedGenre(genre)}</span>
          </div>
        {/each}
        {#each emptySlots(selected) as i (i)}
          <div class="genre-slot is-empty" aria-hidden="true">
            <PlusIcon />
          </div>
        {/each}
      </div>
      <span class="row-caret">
        <CaretRightIcon />
      </span>
    </button>
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
    subtitle={m.label_genres_drawer_subtitle_loved()}
    current={loved}
    other={hated}
    onSave={setLovedGenres}
    onClose={() => (openDrawer = null)}
  />
{:else if openDrawer === 'hated'}
  <GenresDrawer
    title={m.header_genres_hated()}
    subtitle={m.label_genres_drawer_subtitle_hated()}
    current={hated}
    other={loved}
    onSave={setHatedGenres}
    onClose={() => (openDrawer = null)}
  />
{/if}

<style lang="scss">
  @use '$style/scss/mixins/index' as *;

  .trakt-genre-section {
    --genre-tile-size: 92px;

    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover:not([disabled]) {
        background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
      }
    }

    &:active:not([disabled]) {
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .row-caret {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    opacity: 0.35;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
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
    --stroke-0: color-mix(in srgb, var(--color-foreground) 70%, transparent);

    width: var(--genre-tile-size);
    height: var(--genre-tile-size);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-foreground) 5%, transparent);

    :global(svg) {
      width: var(--ni-36);
      height: var(--ni-36);
    }
  }

  .genre-name {
    font-size: var(--ni-12);
    font-weight: 400;
    letter-spacing: normal;
    text-transform: none;
    color: color-mix(in srgb, var(--color-foreground) 70%, transparent);
    text-align: center;
    line-height: 1;
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

</style>
