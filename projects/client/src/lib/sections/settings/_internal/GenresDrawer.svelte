<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { GENRES } from "$lib/features/filters/_internal/genres.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import type { Genre } from "@trakt/api";
  import { untrack } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { GENRE_LIMIT } from "./constants.ts";
  import GenreCard from "./GenreCard.svelte";

  type GenresDrawerProps = {
    title: string;
    subtitle: string;
    current: Genre[];
    onSave: (genres: Genre[]) => Promise<boolean>;
    onClose: () => void;
  };

  const { title, subtitle, current, onSave, onClose }: GenresDrawerProps =
    $props();

  const { confirm } = useConfirm();

  const initialGenres = untrack(() => current);

  const selected = new SvelteSet<Genre>(initialGenres);
  const preselected: ReadonlySet<Genre> = new Set(initialGenres);

  let isSaving = $state(false);
  let saveError = $state(false);

  const hasChanges = $derived(
    selected.size !== preselected.size ||
      [...selected].some((genre) => !preselected.has(genre)),
  );

  const isAtLimit = $derived(selected.size >= GENRE_LIMIT);

  const byTranslatedName = (a: Genre, b: Genre) =>
    toTranslatedGenre(a).localeCompare(toTranslatedGenre(b), languageTag());

  const selectedSorted = $derived([...selected].toSorted(byTranslatedName));

  const catalogGenres = GENRES.toSorted(byTranslatedName);

  const emptySlotCount = $derived(Math.max(0, GENRE_LIMIT - selected.size));

  function isSelectable(genre: Genre): boolean {
    return selected.has(genre) || !isAtLimit;
  }

  function toggle(genre: Genre) {
    if (!isSelectable(genre)) return;
    if (selected.has(genre)) {
      selected.delete(genre);
    } else {
      selected.add(genre);
    }
    saveError = false;
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
    saveError = false;
    try {
      const success = await onSave([...selected]);
      if (success) {
        onClose();
      } else {
        saveError = true;
      }
    } catch (e) {
      console.error("[GenresDrawer] save failed:", e);
      saveError = true;
    } finally {
      isSaving = false;
    }
  }
</script>

{#snippet actions()}
  {#if saveError}
    <span class="save-error">{m.error_text_genres_save_failed()}</span>
  {/if}
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
  <div class="drawer-content" style="--genre-columns: {GENRE_LIMIT}">
    <p class="secondary">{subtitle}</p>
    <div class="selections-sticky">
      <p class="section-label">{m.label_genres_drawer_selected()}</p>
      <div class="selections-row">
        {#each selectedSorted as genre (genre)}
          <GenreCard {genre} isSelected onclick={() => toggle(genre)} />
        {/each}
        {#each { length: emptySlotCount } as _, i (i)}
          <GenreCard />
        {/each}
      </div>
    </div>

    <p class="section-label catalog-label">{m.label_genres_drawer_all()}</p>
    <div class="genre-catalog">
      {#each catalogGenres as genre (genre)}
        <GenreCard
          {genre}
          isSelected={selected.has(genre)}
          disabled={!isSelectable(genre)}
          onclick={() => toggle(genre)}
        />
      {/each}
    </div>
  </div>
</Drawer>

<style lang="scss">
  :global(.trakt-drawer.trakt-genres-drawer) {
    --drawer-padding: var(--gap-s);
    --drawer-gap: var(--gap-micro);
  }

  .save-error {
    font-size: var(--font-size-tag);
    color: var(--color-background-red);
    padding-inline: var(--gap-s);
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    flex: 1;
    min-height: 0;
  }

  .section-label {
    color: var(--color-foreground);
  }

  .catalog-label {
    margin-block-start: var(--gap-m);
  }

  .selections-sticky {
    position: sticky;
    top: 0;
    z-index: var(--layer-base);
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    margin-inline: calc(-1 * var(--drawer-padding));
    padding-block: var(--gap-s);
    padding-inline: var(--drawer-padding);
    background: var(--color-drawer-background);
    border-block-end: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .selections-row {
    display: grid;
    grid-template-columns: repeat(var(--genre-columns), minmax(0, 1fr));
    gap: var(--gap-s);
  }

  .genre-catalog {
    display: grid;
    grid-template-columns: repeat(var(--genre-columns), minmax(0, 1fr));
    gap: var(--gap-s);
    align-content: start;
  }
</style>
