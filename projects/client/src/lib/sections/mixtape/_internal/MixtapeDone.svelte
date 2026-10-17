<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userListsQuery } from "$lib/requests/queries/users/userListsQuery.ts";
  import { map } from "rxjs";
  import type { MixtapeDoneProps } from "./MixtapeDoneProps.ts";
  import type { MixtapeMoveChoice } from "./MixtapeMoveSheetProps.ts";
  import MixtapeMoveSheet from "./MixtapeMoveSheet.svelte";
  import MixtapePicks from "./MixtapePicks.svelte";
  import { useMixtapeSave } from "./useMixtapeSave.ts";

  const {
    rounds,
    picked,
    savedTo,
    closeHref,
    changeHref,
    startOverHref,
    onMore,
    onMoved,
  }: MixtapeDoneProps = $props();

  const lists = useQuery(userListsQuery()).pipe(
    map((query) => query.data ?? []),
  );
  const { move, createList, isMoving } = useMixtapeSave();

  let isSheetOpen = $state(false);
  let moved = $state<{ target: number; name: string } | null>(null);

  const kept = $derived(rounds.flat());
  const newestFirst = $derived(
    rounds
      .map((media, index) => ({ media, round: index + 1 }))
      .filter(({ media }) => media.length > 0)
      .reverse(),
  );
  const isMultiRound = $derived(newestFirst.length > 1);
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

<div class="trakt-mixtape-done">
  <header class="done-header">
    <div class="done-heading">
      <h2>{m.header_mixtape_done()}</h2>
      <p class="small secondary">
        {kept.length === 1
          ? m.text_mixtape_count_one()
          : m.text_mixtape_count({ count: kept.length })}
      </p>
    </div>
    <Link href={closeHref} color="inherit" label={m.button_label_close()}>
      <span class="done-close"><CloseIcon /></span>
    </Link>
  </header>

  <MixtapePicks {picked} />

  {#if kept.length > 0}
    {#if savedToName}
      <button
        type="button"
        class="done-saved"
        aria-haspopup="dialog"
        onclick={() => (isSheetOpen = true)}
      >
        <BookmarkIcon state="added" />
        <span class="done-saved-text">
          {m.text_mixtape_saved_to({ name: savedToName })}
        </span>
        <span class="small secondary">{m.button_text_mixtape_change_target()}</span>
      </button>
    {/if}

    <div class="done-rounds">
      {#each newestFirst as { media, round }, index (round)}
        {#if isMultiRound}
          <p class="done-round small secondary">
            {m.text_mixtape_round({ round })}
          </p>
        {/if}
        <div class="done-thumbs">
          {#each media as item (item.id)}
            <div class="done-cover">
              <CrossOriginImage
                src={item.poster.url.medium}
                alt={m.image_alt_media_poster({ title: item.title })}
              />
              {#if isMultiRound && index === 0}
                <span class="done-new">{m.tag_text_new()}</span>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <p class="secondary">{m.text_mixtape_results_empty()}</p>
  {/if}

  <span class="done-spacer"></span>

  <div class="done-buttons">
    <div class="done-row">
      {#if onMore}
        <Button
          color="purple"
          label={m.button_text_mixtape_show_more()}
          onclick={onMore}
        >
          {m.button_text_mixtape_show_more()}
        </Button>
      {/if}
      <Button
        href={closeHref}
        variant="secondary"
        label={m.button_text_mixtape_finish()}
      >
        {m.button_text_mixtape_finish()}
      </Button>
    </div>
    <div class="done-row">
      <Button
        href={changeHref}
        variant="secondary"
        style="ghost"
        label={m.button_text_mixtape_change_picks()}
      >
        {m.button_text_mixtape_change_picks()}
      </Button>
      <Button
        href={startOverHref}
        variant="secondary"
        style="ghost"
        label={m.button_text_mixtape_start_over()}
      >
        {m.button_text_mixtape_start_over()}
      </Button>
    </div>
  </div>
</div>

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
  .trakt-mixtape-done {
    position: relative;
    box-sizing: border-box;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding: var(--gap-s) var(--gap-m) var(--gap-l);
    padding-block-start: calc(var(--gap-s) + env(safe-area-inset-top));
    padding-block-end: calc(var(--gap-l) + env(safe-area-inset-bottom));

    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
      var(--color-background) 60%
    );

    p,
    h2 {
      margin: 0;
    }
  }

  .done-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .done-heading {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .done-close {
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .done-saved {
    all: unset;
    box-sizing: border-box;
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

  .done-saved-text {
    flex: 1;
    min-width: 0;
  }

  .done-rounds {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    overflow-y: auto;
  }

  .done-round {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    &::after {
      content: "";
      flex: 1;
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }
  }

  .done-new {
    position: absolute;
    inset-block-start: var(--ni-6);
    inset-inline-start: var(--ni-6);
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--purple-50);
    font-size: var(--font-size-tag);
    font-weight: 700;
  }

  .done-thumbs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }

  .done-cover {
    position: relative;
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .done-spacer {
    flex: 1;
  }

  .done-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-button) {
      width: 100%;
    }
  }

  .done-row {
    display: flex;
    gap: var(--gap-s);

    > :global(*) {
      flex: 1;
    }
  }
</style>
