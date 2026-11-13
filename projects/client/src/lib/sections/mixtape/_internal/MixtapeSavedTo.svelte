<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
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
    <CheckIcon />
    <span class="saved-to-text">
      {m.text_mixtape_saved_to({ name: savedToName })}
    </span>
    <span class="saved-to-change">
      {m.button_text_mixtape_change_target()}
    </span>
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
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-saved-to {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    max-width: 100%;
    padding-block: var(--ni-4);

    color: var(--color-text-primary);
    font-size: var(--font-size-text-small);
    cursor: pointer;

    :global(svg) {
      flex: none;
      width: var(--ni-12);
      height: var(--ni-12);
    }

    &:focus-visible {
      border-radius: var(--border-radius-s);
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-4);
    }
  }

  .saved-to-text {
    min-width: 0;
    font-weight: 600;
  }

  .saved-to-change {
    flex: none;
    padding: var(--ni-4) var(--ni-10);

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    color: var(--color-text-secondary);
    font-weight: 600;

    transition:
      background var(--transition-increment) ease-in-out,
      color var(--transition-increment) ease-in-out;

    @include for-mouse {
      .trakt-mixtape-saved-to:hover & {
        background: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
        color: var(--color-text-primary);
      }
    }
  }
</style>
