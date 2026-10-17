<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userListsQuery } from "$lib/requests/queries/users/userListsQuery.ts";
  import { map } from "rxjs";
  import type { MixtapeMoveChoice } from "./MixtapeMoveSheetProps.ts";
  import MixtapeMoveSheet from "./MixtapeMoveSheet.svelte";
  import type { MixtapeSavedToProps } from "./MixtapeSavedToProps.ts";
  import { useMixtapeSave } from "./useMixtapeSave.ts";

  const { kept, picked, savedTo, onMoved }: MixtapeSavedToProps = $props();

  const lists = useQuery(userListsQuery()).pipe(
    map((query) => query.data ?? []),
  );
  const { move, createList, isMoving } = useMixtapeSave();

  let isSheetOpen = $state(false);
  let moved = $state<{ target: number; name: string } | null>(null);

  const savedToName = $derived(
    savedTo == null
      ? m.page_title_watchlist()
      : ($lists.find(({ id }) => id === savedTo)?.name ??
          (moved?.target === savedTo ? moved.name : null)),
  );
  const suggestedName = $derived(
    m.text_mixtape_new_list_name({
      picks: picked.map(({ title }) => title).join(" + "),
    }),
  );

  const confirmMove = async (choice: MixtapeMoveChoice) => {
    const destination =
      "newName" in choice
        ? { target: await createList(choice.newName), name: choice.newName }
        : choice;
    if ("newName" in choice && destination.target == null) return;

    const isMoved = await move({
      from: savedTo,
      to: destination.target,
      toName: destination.name,
      media: kept,
      onMoved,
    });
    if (!isMoved) return;
    if (destination.target != null) {
      moved = { target: destination.target, name: destination.name };
    }
    isSheetOpen = false;
  };
</script>

{#if savedToName}
  <button
    type="button"
    class="trakt-mixtape-saved-to"
    aria-haspopup="dialog"
    onclick={() => (isSheetOpen = true)}
  >
    <BookmarkIcon state="added" />
    <span class="saved-to-text">
      {m.text_mixtape_saved_to({ name: savedToName })}
    </span>
    <span class="small secondary">{m.button_text_mixtape_change_target()}</span>
  </button>
{/if}

{#if isSheetOpen}
  <MixtapeMoveSheet
    current={savedTo}
    currentName={savedToName ?? m.page_title_watchlist()}
    lists={$lists}
    {suggestedName}
    isMoving={$isMoving}
    onClose={() => (isSheetOpen = false)}
    onConfirm={confirmMove}
  />
{/if}

<style lang="scss">
  .trakt-mixtape-saved-to {
    all: unset;
    box-sizing: border-box;
    width: var(--width-mixtape-saved, auto);
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--ni-12) var(--ni-14);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    cursor: pointer;

    :global(svg) {
      flex: none;
      color: var(--purple-400);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }
  }

  .saved-to-text {
    flex: 1;
    min-width: 0;
  }
</style>
