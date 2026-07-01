<script lang="ts">
  import ActionButton from '$lib/components/buttons/ActionButton.svelte';
  import Drawer from '$lib/components/drawer/Drawer.svelte';
  import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
  import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
  import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType';
  import { useConfirm } from '$lib/features/confirmation/useConfirm';
  import * as m from '$lib/features/i18n/messages';
  import { GENRES } from '$lib/features/filters/_internal/genres';
  import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre';
  import type { Genre } from '@trakt/api';
  import { SvelteSet } from 'svelte/reactivity';
  import StreamingServiceBadge from './streaming-services/StreamingServiceBadge.svelte';

  const genreLimit = 5;

  type GenresDrawerProps = {
    title: string;
    current: Genre[];
    other: Genre[];
    onSave: (genres: Genre[]) => Promise<void>;
    onClose: () => void;
  };

  const { title, current, other, onSave, onClose }: GenresDrawerProps = $props();

  const { confirm } = useConfirm();

  const selected = new SvelteSet<Genre>(current);
  let isSaving = $state(false);

  const otherSet = $derived(new Set(other));

  const hasChanges = $derived.by(() => {
    if (selected.size !== current.length) return true;
    return current.some((g) => !selected.has(g));
  });

  const isAtLimit = $derived(selected.size >= genreLimit);

  const sortedGenres = $derived(
    [...GENRES].sort((a, b) =>
      toTranslatedGenre(a).localeCompare(toTranslatedGenre(b))
    ),
  );

  const selectedSorted = $derived(
    [...selected].sort((a, b) =>
      toTranslatedGenre(a).localeCompare(toTranslatedGenre(b))
    ),
  );

  const emptySlotCount = $derived(genreLimit - selected.size);

  function isSelectable(genre: Genre): boolean {
    if (otherSet.has(genre)) return false;
    return selected.has(genre) || !isAtLimit;
  }

  function toggle(genre: Genre) {
    if (!isSelectable(genre)) return;
    if (selected.has(genre)) {
      selected.delete(genre);
    } else {
      selected.add(genre);
    }
  }

  function handleClose() {
    if (!hasChanges) {
      onClose();
      return;
    }
    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: onClose,
    })();
  }

  async function handleSave() {
    isSaving = true;
    try {
      await onSave([...selected]);
      onClose();
    } finally {
      isSaving = false;
    }
  }
</script>

{#snippet actions()}
  <ActionButton
    label={m.button_label_apply()}
    color="purple"
    disabled={isSaving || !hasChanges}
    onclick={handleSave}
  >
    <CheckIcon />
  </ActionButton>
{/snippet}

<Drawer
  onClose={handleClose}
  {title}
  size="large"
  classList="trakt-genres-drawer"
  {actions}
>
  <div class="trakt-genres-drawer-content">
    <div class="selections-sticky">
      <div class="selections-row">
        {#each selectedSorted as genre (genre)}
          <button
            class="genre-tile is-selected"
            type="button"
            data-genre={genre}
            aria-pressed="true"
            aria-label={m.button_label_toggle_genre({
              genre: toTranslatedGenre(genre),
            })}
            onclick={() => toggle(genre)}
          >
            <StreamingServiceBadge name={toTranslatedGenre(genre)} />
            <span class="tile-check" aria-hidden="true">
              <CheckIcon />
            </span>
          </button>
        {/each}
        {#each { length: emptySlotCount } as _, i (i)}
          <div class="genre-slot-empty" aria-hidden="true">
            <PlusIcon />
          </div>
        {/each}
      </div>
    </div>

    <div class="genre-catalog">
      {#each sortedGenres as genre (genre)}
        {@const isSelected = selected.has(genre)}
        {@const isExcluded = otherSet.has(genre)}
        {@const disabled = !isSelectable(genre)}
        <button
          class="genre-tile"
          class:is-selected={isSelected}
          class:is-excluded={isExcluded}
          type="button"
          data-genre={genre}
          aria-pressed={isSelected}
          aria-label={m.button_label_toggle_genre({
            genre: toTranslatedGenre(genre),
          })}
          {disabled}
          onclick={() => toggle(genre)}
        >
          <StreamingServiceBadge name={toTranslatedGenre(genre)} />
          {#if isSelected}
            <span class="tile-check" aria-hidden="true">
              <CheckIcon />
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use '$style/scss/mixins/index' as *;

  :global(.trakt-drawer.trakt-genres-drawer) {
    --drawer-padding: var(--gap-s);
  }

  .trakt-genres-drawer-content {
    --genre-tile-size: 70px;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    flex: 1;
    min-height: 0;
  }

  .selections-sticky {
    position: sticky;
    top: 0;
    z-index: var(--layer-base);
    margin-inline: calc(-1 * var(--drawer-padding));
    padding-block: var(--gap-s);
    padding-inline: var(--drawer-padding);
    background: var(--color-drawer-background);
    border-block-end: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .selections-row {
    display: flex;
    gap: var(--gap-s);
    align-items: stretch;
  }

  .genre-slot-empty {
    width: var(--genre-tile-size);
    height: var(--genre-tile-size);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) dashed
      color-mix(in srgb, var(--color-foreground) 20%, transparent);
    color: color-mix(in srgb, var(--color-foreground) 30%, transparent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .genre-catalog {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--genre-tile-size));
    gap: var(--gap-s);
    align-content: start;
  }

  .genre-tile {
    position: relative;
    display: block;
    width: var(--genre-tile-size);
    height: var(--genre-tile-size);
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    border-radius: var(--border-radius-m);

    :global(.trakt-streaming-service-badge) {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      transition: var(--transition-increment) ease-in-out;
      transition-property: opacity, border-color, background;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &.is-excluded {
      :global(.trakt-streaming-service-badge) {
        opacity: var(--de-emphasized-opacity);
        filter: grayscale(0.4);
      }
    }

    &.is-selected {
      :global(.trakt-streaming-service-badge) {
        border-color: var(--color-background-purple);
      }
    }
  }

  .tile-check {
    position: absolute;
    top: var(--ni-neg-6);
    inset-inline-end: var(--ni-neg-4);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-18);
    height: var(--ni-18);
    border-radius: 50%;
    background: var(--color-background-purple);
    color: var(--shade-10);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    :global(svg path) {
      stroke-width: 3;
    }
  }

  /* Genre-specific gradient backgrounds via --badge-background inheritance */
  .genre-tile[data-genre='action'] {
    --badge-background: linear-gradient(135deg, var(--red-700), var(--red-900));
  }
  .genre-tile[data-genre='adventure'] {
    --badge-background: linear-gradient(135deg, var(--blue-500), var(--blue-800));
  }
  .genre-tile[data-genre='animation'] {
    --badge-background: linear-gradient(135deg, var(--purple-500), var(--purple-800));
  }
  .genre-tile[data-genre='anime'] {
    --badge-background: linear-gradient(135deg, var(--purple-400), var(--purple-700));
  }
  .genre-tile[data-genre='biography'] {
    --badge-background: linear-gradient(135deg, var(--shade-400), var(--shade-700));
  }
  .genre-tile[data-genre='children'] {
    --badge-background: linear-gradient(135deg, var(--yellow-400), var(--orange-500));
  }
  .genre-tile[data-genre='comedy'] {
    --badge-background: linear-gradient(135deg, var(--yellow-500), var(--yellow-700));
  }
  .genre-tile[data-genre='crime'] {
    --badge-background: linear-gradient(135deg, var(--shade-600), var(--shade-900));
  }
  .genre-tile[data-genre='documentary'] {
    --badge-background: linear-gradient(135deg, var(--green-500), var(--green-800));
  }
  .genre-tile[data-genre='drama'] {
    --badge-background: linear-gradient(135deg, var(--purple-600), var(--purple-900));
  }
  .genre-tile[data-genre='family'] {
    --badge-background: linear-gradient(135deg, var(--orange-400), var(--orange-700));
  }
  .genre-tile[data-genre='fantasy'] {
    --badge-background: linear-gradient(135deg, var(--blue-600), var(--purple-700));
  }
  .genre-tile[data-genre='history'] {
    --badge-background: linear-gradient(135deg, var(--orange-600), var(--red-800));
  }
  .genre-tile[data-genre='holiday'] {
    --badge-background: linear-gradient(135deg, var(--green-400), var(--green-700));
  }
  .genre-tile[data-genre='horror'] {
    --badge-background: linear-gradient(135deg, var(--red-800), var(--shade-900));
  }
  .genre-tile[data-genre='musical'] {
    --badge-background: linear-gradient(135deg, var(--purple-500), var(--blue-700));
  }
  .genre-tile[data-genre='mystery'] {
    --badge-background: linear-gradient(135deg, var(--blue-700), var(--shade-800));
  }
  .genre-tile[data-genre='romance'] {
    --badge-background: linear-gradient(135deg, var(--red-500), var(--red-800));
  }
  .genre-tile[data-genre='science-fiction'] {
    --badge-background: linear-gradient(135deg, var(--blue-500), var(--blue-900));
  }
  .genre-tile[data-genre='superhero'] {
    --badge-background: linear-gradient(135deg, var(--blue-600), var(--red-700));
  }
  .genre-tile[data-genre='suspense'] {
    --badge-background: linear-gradient(135deg, var(--purple-700), var(--shade-900));
  }
  .genre-tile[data-genre='thriller'] {
    --badge-background: linear-gradient(135deg, var(--shade-700), var(--shade-900));
  }
  .genre-tile[data-genre='war'] {
    --badge-background: linear-gradient(135deg, var(--yellow-700), var(--shade-800));
  }
  .genre-tile[data-genre='western'] {
    --badge-background: linear-gradient(135deg, var(--orange-700), var(--red-900));
  }
</style>
