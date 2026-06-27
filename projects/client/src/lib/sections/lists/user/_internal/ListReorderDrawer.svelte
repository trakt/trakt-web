<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { reorderListRequest } from "$lib/requests/queries/users/reorderListRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { assertDefined } from "$lib/utils/assert/assertDefined.ts";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets.ts";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import type { ReorderListSource } from "../models/ReorderListSource.ts";
  import type { ReorderableListItem } from "./models/ReorderableListItem.ts";
  import { type DragGhost, reorderDrag } from "./reorderDrag.ts";
  import {
    itemOrderSignature,
    listItemRankIds,
    sortReorderableItems,
  } from "./reorderListItems.ts";
  import { useReorderList } from "./useReorderList.ts";

  const {
    source,
    title,
    onClose,
  }: {
    source: ReorderListSource;
    title: string;
    onClose: () => void;
  } = $props();

  const { list, isLoading } = $derived(useReorderList(source));
  const { invalidateAll } = useInvalidator();
  const { confirm } = useConfirm();

  let localOrder = $state<{
    signature: string;
    items: ReorderableListItem[];
  } | null>(null);
  let isApplying = $state(false);
  let draggedKey = $state<string | null>(null);
  let instantPosterKeys = $state<readonly string[]>([]);
  let placeholderIndex = $state<number | null>(null);
  let dragGhost = $state<DragGhost | null>(null);

  const rankOrderedItems = $derived(sortReorderableItems($list ?? []));
  const rankSignature = $derived(itemOrderSignature(rankOrderedItems));
  const orderedItems = $derived(
    localOrder?.signature === rankSignature
      ? localOrder.items
      : rankOrderedItems,
  );
  const orderedSignature = $derived(itemOrderSignature(orderedItems));
  const isLoaded = $derived(!$isLoading);
  const hasChanges = $derived(isLoaded && orderedSignature !== rankSignature);
  const canApply = $derived(hasChanges && !isApplying);
  const draggedItem = $derived(
    orderedItems.find((item) => item.key === draggedKey),
  );
  const visibleItems = $derived(
    draggedKey == null
      ? orderedItems
      : orderedItems.filter((item) => item.key !== draggedKey),
  );
  const draggedItemRank = $derived(
    draggedKey == null
      ? null
      : (placeholderIndex ??
          orderedItems.findIndex((item) => item.key === draggedKey)) + 1,
  );
  const dragGhostStyle = $derived(
    dragGhost == null
      ? ""
      : `top: ${dragGhost.top}px; left: ${dragGhost.left}px; width: ${dragGhost.width}px; height: ${dragGhost.height}px;`,
  );
  const renderRows = $derived.by(() => {
    const rows: (
      | { key: string; type: "placeholder" }
      | { key: string; type: "item"; item: ReorderableListItem; rank: number }
    )[] = [];

    visibleItems.forEach((item, index) => {
      if (placeholderIndex === index) {
        rows.push({ key: "drag-placeholder", type: "placeholder" });
      }

      rows.push({
        key: item.key,
        type: "item",
        item,
        rank: itemRank(index),
      });
    });

    if (placeholderIndex === visibleItems.length) {
      rows.push({ key: "drag-placeholder", type: "placeholder" });
    }

    return rows;
  });

  function itemRank(index: number) {
    if (placeholderIndex == null || index < placeholderIndex) {
      return index + 1;
    }

    return index + 2;
  }

  function shouldAnimatePoster(item: ReorderableListItem) {
    return !instantPosterKeys.includes(item.key);
  }

  function onDragStart(key: string, ghost: DragGhost, fromIndex: number) {
    draggedKey = key;
    dragGhost = ghost;
    placeholderIndex = fromIndex;
  }

  function onGhostMove(ghost: DragGhost) {
    dragGhost = ghost;
  }

  function onPlaceholderMove(index: number) {
    placeholderIndex = index;
  }

  function onDragEnd(
    key: string | null,
    finalIndex: number | null,
    cancelled: boolean,
  ) {
    if (!cancelled && key != null && finalIndex != null) {
      const item = orderedItems.find((i) => i.key === key);

      if (item) {
        const visible = orderedItems.filter((i) => i.key !== key);

        localOrder = {
          signature: rankSignature,
          items: [
            ...visible.slice(0, finalIndex),
            item,
            ...visible.slice(finalIndex),
          ],
        };
      }

      if (!instantPosterKeys.includes(key)) {
        instantPosterKeys = [...instantPosterKeys, key];
      }
    }

    draggedKey = null;
    placeholderIndex = null;
    dragGhost = null;
  }

  async function requestReorder() {
    return reorderListRequest({
      userId: assertDefined(
        source.list.user.slug,
        "Expected user list to have a user slug",
      ),
      listId: source.list.id,
      rank: listItemRankIds(orderedItems),
    });
  }

  async function refreshReorderedItems() {
    await invalidateAll([
      InvalidateAction.Listed("movie"),
      InvalidateAction.Listed("show"),
    ]);
  }

  async function handleApply() {
    if (!canApply) {
      return;
    }

    isApplying = true;

    try {
      const result = await requestReorder();

      if (result) {
        onClose();
        await refreshReorderedItems();
      }
    } catch {
      // drawer stays open for retry
    } finally {
      isApplying = false;
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

  function dragGhostPortal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

{#snippet itemSummary(item: ReorderableListItem, animatePoster = true)}
  <div class="item-summary">
    <CrossOriginImage
      src={item.posterUrl ?? MEDIA_POSTER_PLACEHOLDER}
      alt={m.image_alt_media_poster({ title: item.title })}
      animate={animatePoster}
      loading={animatePoster ? "lazy" : "eager"}
      classList="reorder-item-poster"
    />
    <div class="item-title">
      <span class="bold ellipsis">{item.title}</span>
      {#if item.subtitle}
        <span class="small secondary ellipsis">
          {item.subtitle}
        </span>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet dragHandle()}
  <div class="drag-handle" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
{/snippet}

<Drawer
  onClose={handleClose}
  title={m.drawer_title_reorder_list()}
  metaInfo={title}
  size="large"
  headerVariant="overlay"
>
  {#snippet actions()}
    <ActionButton
      label={m.button_label_apply()}
      color="purple"
      disabled={!canApply}
      onclick={handleApply}
    >
      <CheckIcon />
    </ActionButton>
  {/snippet}

  <div class="reorder-drawer">
    {#if !isLoaded}
      <div class="reorder-loading" role="status" aria-live="polite">
        <LoadingIndicator />
        <p class="secondary bold">{m.yir_state_loading()}</p>
      </div>
    {:else if orderedItems.length === 0}
      <p class="secondary">{m.list_placeholder_empty()}</p>
    {:else}
      <table class="reorder-table">
        <tbody
          use:reorderDrag={{
            getItems: () => orderedItems,
            onDragStart,
            onGhostMove,
            onPlaceholderMove,
            onDragEnd,
          }}
          class:has-active-drag={draggedKey != null}
        >
          {#each renderRows as row (row.key)}
            <tr
              data-reorder-key={row.type === "item" ? row.item.key : undefined}
              class:drag-placeholder={row.type === "placeholder"}
              animate:flip={{ duration: 220, easing: cubicOut }}
            >
              <td class="rank-cell">
                {#if row.type === "item"}
                  <span class="bold">#{row.rank}</span>
                {/if}
              </td>
              <td>
                {#if row.type === "item"}
                  {@render itemSummary(row.item, shouldAnimatePoster(row.item))}
                {:else}
                  <div class="placeholder-space"></div>
                {/if}
              </td>
              <td class="actions-cell">
                {#if row.type === "item"}
                  <div class="reorder-actions">
                    {@render dragHandle()}
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  {#if draggedItem && dragGhost && draggedItemRank != null}
    <div
      class="drag-ghost"
      style={dragGhostStyle}
      aria-hidden="true"
      use:dragGhostPortal
    >
      <div class="ghost-cell rank-cell">
        <span class="bold">#{draggedItemRank}</span>
      </div>
      <div class="ghost-cell">
        {@render itemSummary(draggedItem, false)}
      </div>
      <div class="ghost-cell actions-cell">
        <div class="reorder-actions">
          {@render dragHandle()}
        </div>
      </div>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .reorder-drawer {
    --reorder-row-background: var(--color-card-background);

    min-height: 100%;
    padding-bottom: var(--gap-m);
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .reorder-loading {
    min-height: var(--ni-220);
    display: grid;
    align-content: center;
    justify-items: center;
    gap: var(--gap-xs);
  }

  .reorder-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 calc((var(--gap-xs) + var(--gap-s)) / 2);
  }

  td {
    box-sizing: border-box;
    position: relative;
    padding: var(--ni-8);
    text-align: start;
    vertical-align: middle;
  }

  tbody {
    tr {
      cursor: default;
      filter: drop-shadow(
        var(--ni-1) var(--ni-1) var(--ni-4)
          color-mix(in srgb, var(--color-shadow) 10%, transparent)
      );
      transition: opacity var(--transition-increment) ease-in-out;
    }

    &.has-active-drag {
      tr:not(.drag-placeholder) {
        opacity: var(--de-emphasized-opacity);
      }
    }

    td {
      user-select: none;
      -webkit-user-select: none;
      background: var(--reorder-row-background);

      &:first-child {
        border-start-start-radius: var(--border-radius-m);
        border-end-start-radius: var(--border-radius-m);
      }

      &:last-child {
        border-start-end-radius: var(--border-radius-m);
        border-end-end-radius: var(--border-radius-m);
      }
    }
  }

  .drag-placeholder {
    cursor: grabbing;
    filter: none;
    pointer-events: none;

    td {
      background: transparent;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        pointer-events: none;
        border-top: var(--border-thickness-xxs) dashed
          color-mix(in srgb, var(--color-background-purple) 48%, transparent);
        border-bottom: var(--border-thickness-xxs) dashed
          color-mix(in srgb, var(--color-background-purple) 48%, transparent);
      }

      &:first-child {
        &::after {
          border-inline-start: var(--border-thickness-xxs) dashed
            color-mix(in srgb, var(--color-background-purple) 48%, transparent);
          border-start-start-radius: var(--border-radius-m);
          border-end-start-radius: var(--border-radius-m);
        }
      }

      &:last-child {
        &::after {
          border-inline-end: var(--border-thickness-xxs) dashed
            color-mix(in srgb, var(--color-background-purple) 48%, transparent);
          border-start-end-radius: var(--border-radius-m);
          border-end-end-radius: var(--border-radius-m);
        }
      }
    }
  }

  .placeholder-space {
    min-height: calc(var(--ni-40) * 1.5);
  }

  .rank-cell {
    width: var(--ni-56);
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .actions-cell {
    width: var(--ni-56);
  }

  .item-summary {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .item-summary :global(.reorder-item-poster) {
    width: var(--ni-40);
    aspect-ratio: 2 / 3;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: var(--border-radius-s);
    background-color: var(--color-surface-button-disabled);
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .item-title {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .reorder-actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drag-handle {
    all: unset;
    width: var(--ni-32);
    height: var(--ni-32);
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(2, var(--ni-4));
    grid-template-rows: repeat(3, var(--ni-4));
    place-content: center;
    gap: var(--ni-3);
    border-radius: var(--border-radius-m);
    color: var(--color-text-secondary);
    cursor: grab;
    touch-action: none;

    span {
      width: var(--ni-4);
      height: var(--ni-4);
      border-radius: 50%;
      background: currentColor;
    }
  }

  .drag-ghost {
    position: fixed;
    z-index: calc(var(--layer-top) + 1);
    pointer-events: none;

    display: grid;
    grid-template-columns: var(--ni-56) minmax(0, 1fr) var(--ni-56);
    align-items: center;
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: var(--shadow-menu);
    color: var(--color-text-primary);
    opacity: 1;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    will-change: left, top;

    .ghost-cell {
      box-sizing: border-box;
      min-width: 0;
      padding: var(--ni-8);
    }

    .drag-handle {
      color: var(--color-text-primary);
    }
  }
</style>
