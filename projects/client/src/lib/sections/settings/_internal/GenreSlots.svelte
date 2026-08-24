<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { genreIcons } from "$lib/components/icons/genres/genreIcons.ts";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import { GENRE_LIMIT } from "./constants.ts";
  import GenresDrawer from "./GenresDrawer.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import { useSettings } from "./useSettings.ts";

  const { genres, isSavingSettings, setLovedGenres } = useSettings();

  let isDrawerOpen = $state(false);

  const isSaving = $derived($isSavingSettings);
  const loved = $derived($genres?.loved ?? []);
</script>

<SettingsGroupCard title={m.header_genres_loved()}>
  <button
    class="trakt-genre-section"
    type="button"
    aria-label={m.button_label_edit_loved_genres()}
    disabled={isSaving}
    style="--genre-columns: {GENRE_LIMIT}"
    onclick={() => (isDrawerOpen = true)}
  >
    <div class="slots-row">
      {#each loved as genre (genre)}
        <div class="genre-slot" data-genre={genre}>
          {@html genreIcons[genre]}
          <span class="genre-name small">{toTranslatedGenre(genre)}</span>
        </div>
      {/each}
      {#each { length: Math.max(0, GENRE_LIMIT - loved.length) } as _, i (i)}
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

{#if isDrawerOpen}
  <GenresDrawer
    title={m.header_genres_loved()}
    subtitle={m.label_genres_drawer_subtitle_loved()}
    current={loved}
    onSave={setLovedGenres}
    onClose={() => (isDrawerOpen = false)}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-genre-section {
    --genre-tile-size: 92px;

    display: flex;
    align-items: center;
    justify-content: space-between;
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
    display: grid;
    grid-template-columns: repeat(var(--genre-columns), minmax(0, 1fr));
    gap: var(--gap-s);
    flex: 1;
    align-items: center;
    min-width: 0;
    max-width: calc(
      var(--genre-columns) * var(--genre-tile-size) +
        (var(--genre-columns) - 1) * var(--gap-s)
    );
  }

  .genre-slot {
    @include genre-tile-surface;

    overflow: hidden;

    :global(svg) {
      width: min(var(--ni-36), 45%);
      height: min(var(--ni-36), 45%);
    }
  }

  .genre-name {
    color: color-mix(in srgb, var(--color-foreground) 70%, transparent);
    text-align: center;
    line-height: 1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
