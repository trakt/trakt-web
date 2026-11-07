<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Genre } from "@trakt/api";
  import { GENRE_LIMIT } from "./constants.ts";
  import GenreCard from "./GenreCard.svelte";
  import GenresDrawer from "./GenresDrawer.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import { useSettings } from "./useSettings.ts";

  type GenreSlotsSection = {
    title: string;
    editLabel: string;
    subtitle: string;
    genres: Genre[];
    onSave: (genres: Genre[]) => Promise<boolean>;
  };

  const { genres, isSavingSettings, setGenres } = useSettings();

  let openDrawer = $state<"loved" | "disliked" | null>(null);

  const isSaving = $derived($isSavingSettings);
  const loved = $derived($genres?.loved ?? []);
  const disliked = $derived($genres?.disliked ?? []);

  const without = (genres: Genre[], removed: Genre[]) =>
    genres.filter((genre) => !removed.includes(genre));

  const sections = $derived({
    loved: {
      title: m.header_genres_loved(),
      editLabel: m.button_label_edit_loved_genres(),
      subtitle: m.label_genres_drawer_subtitle_loved(),
      genres: loved,
      onSave: (picked: Genre[]) =>
        setGenres({
          loved: picked,
          disliked: without(disliked, picked),
          action: "genres",
        }),
    },
    disliked: {
      title: m.header_genres_disliked(),
      editLabel: m.button_label_edit_disliked_genres(),
      subtitle: m.label_genres_drawer_subtitle_disliked(),
      genres: disliked,
      onSave: (picked: Genre[]) =>
        setGenres({
          loved: without(loved, picked),
          disliked: picked,
          action: "disliked_genres",
        }),
    },
  } satisfies Record<"loved" | "disliked", GenreSlotsSection>);
</script>

{#snippet slots(kind: "loved" | "disliked")}
  {@const section = sections[kind]}
  <SettingsGroupCard title={section.title}>
    <button
      class="trakt-genre-section"
      type="button"
      aria-label={section.editLabel}
      disabled={isSaving}
      style="--genre-columns: {GENRE_LIMIT}"
      onclick={() => (openDrawer = kind)}
    >
      <div class="slots-row">
        {#each section.genres as genre (genre)}
          <GenreCard {genre} />
        {/each}
        {#each { length: Math.max(0, GENRE_LIMIT - section.genres.length) } as _, i (i)}
          <GenreCard />
        {/each}
      </div>
      <span class="row-caret">
        <CaretRightIcon />
      </span>
    </button>
  </SettingsGroupCard>
{/snippet}

{@render slots("loved")}
{@render slots("disliked")}

{#if openDrawer}
  {@const section = sections[openDrawer]}
  <GenresDrawer
    title={section.title}
    subtitle={section.subtitle}
    current={section.genres}
    onSave={section.onSave}
    onClose={() => (openDrawer = null)}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-genre-section {
    --genre-tile-size: var(--ni-80);

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
</style>
