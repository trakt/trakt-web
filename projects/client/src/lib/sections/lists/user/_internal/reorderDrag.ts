import type { ReorderableListItem } from './models/ReorderableListItem.ts';

export type DragGhost = {
  top: number;
  left: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

type ReorderDragParams = {
  getItems: () => readonly ReorderableListItem[];
  onDragStart: (key: string, ghost: DragGhost, fromIndex: number) => void;
  onGhostMove: (ghost: DragGhost) => void;
  onPlaceholderMove: (index: number) => void;
  onDragEnd: (
    key: string | null,
    placeholderIndex: number | null,
    cancelled: boolean,
  ) => void;
  rowDataAttribute?: string;
  scrollContainerClassName?: string;
  dragHandleSelector?: string;
};

const autoScrollEdgeSize = 88;
const autoScrollMaxDistance = 14;

export function reorderDrag(
  node: HTMLTableSectionElement,
  initialParams: ReorderDragParams,
) {
  let params = initialParams;

  const rowAttr = params.rowDataAttribute ?? 'data-reorder-key';
  const rowDatasetKey = rowAttr
    .replace(/^data-/, '')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const scrollClass = params.scrollContainerClassName ?? 'trakt-drawer-content';
  const handleSelector = params.dragHandleSelector ?? '.drag-handle';

  let draggedKey: string | null = null;
  let dragGhost: DragGhost | null = null;
  let placeholderIndex: number | null = null;
  let dragPointerId: number | null = null;
  let dragClientY = 0;
  let autoScrollFrame: number | null = null;
  let scrollContainer: HTMLElement | null = null;

  function getPointerDropIndex(clientY: number): number | null {
    if (draggedKey == null) return null;

    const rows = Array.from(
      node.querySelectorAll<HTMLTableRowElement>(`[${rowAttr}]`),
    );

    if (rows.length === 0) return 0;

    const targetIndex = rows.findIndex((row) => {
      const rect = row.getBoundingClientRect();
      return clientY < rect.top + rect.height / 2;
    });

    return targetIndex < 0 ? rows.length : targetIndex;
  }

  function getScrollContainer(): HTMLElement | null {
    const element = node.closest(`.${scrollClass}`);
    return element instanceof HTMLElement ? element : null;
  }

  function scrollStep(distanceFromEdge: number): number {
    const distance = Math.max(distanceFromEdge, 0);
    const intensity = Math.min(
      (autoScrollEdgeSize - distance) / autoScrollEdgeSize,
      1,
    );
    return Math.ceil(autoScrollMaxDistance * intensity);
  }

  function scrollDistance(): number {
    if (!scrollContainer) return 0;

    const containerRect = scrollContainer.getBoundingClientRect();
    const distanceFromTop = dragClientY - containerRect.top;
    const distanceFromBottom = containerRect.bottom - dragClientY;
    const maxScrollTop = scrollContainer.scrollHeight -
      scrollContainer.clientHeight;

    if (distanceFromTop < autoScrollEdgeSize && scrollContainer.scrollTop > 0) {
      return -scrollStep(distanceFromTop);
    }

    if (
      distanceFromBottom < autoScrollEdgeSize &&
      scrollContainer.scrollTop < maxScrollTop
    ) {
      return scrollStep(distanceFromBottom);
    }

    return 0;
  }

  function tickAutoScroll() {
    autoScrollFrame = null;
    if (dragPointerId == null || !scrollContainer) return;

    const delta = scrollDistance();
    const prevScrollTop = scrollContainer.scrollTop;
    scrollContainer.scrollTop += delta;

    if (scrollContainer.scrollTop !== prevScrollTop) {
      const toIndex = getPointerDropIndex(dragClientY);
      if (toIndex != null && toIndex !== placeholderIndex) {
        placeholderIndex = toIndex;
        params.onPlaceholderMove(toIndex);
      }
    }

    startAutoScroll();
  }

  function startAutoScroll() {
    if (autoScrollFrame != null) return;
    autoScrollFrame = requestAnimationFrame(tickAutoScroll);
  }

  function stopAutoScroll() {
    if (autoScrollFrame == null) return;
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }

  function endDrag(cancelled: boolean) {
    stopAutoScroll();

    if (dragPointerId != null) {
      try {
        if (node.hasPointerCapture(dragPointerId)) {
          node.releasePointerCapture(dragPointerId);
        }
      } catch {
        // Browser may have already released capture during pointercancel.
      }
    }

    const endedKey = draggedKey;
    const endedIndex = placeholderIndex;

    draggedKey = null;
    dragGhost = null;
    placeholderIndex = null;
    dragPointerId = null;
    scrollContainer = null;

    params.onDragEnd(endedKey, endedIndex, cancelled);
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerId !== dragPointerId) return;
    event.preventDefault();

    dragClientY = event.clientY;

    if (dragGhost) {
      dragGhost = {
        ...dragGhost,
        left: event.clientX - dragGhost.offsetX,
        top: event.clientY - dragGhost.offsetY,
      };
      params.onGhostMove(dragGhost);
    }

    const toIndex = getPointerDropIndex(event.clientY);
    if (toIndex != null && toIndex !== placeholderIndex) {
      placeholderIndex = toIndex;
      params.onPlaceholderMove(toIndex);
    }
  }

  function handlePointerUp(event: PointerEvent) {
    if (event.pointerId !== dragPointerId) return;
    endDrag(false);
  }

  function handlePointerCancel(event: PointerEvent) {
    if (event.pointerId !== dragPointerId) return;
    endDrag(true);
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (!target.closest(handleSelector)) return;

    const row = target.closest<HTMLTableRowElement>(
      `[${rowAttr}]`,
    );
    const key = row?.dataset[rowDatasetKey];
    if (!key) return;

    const fromIndex = params.getItems().findIndex((item) => item.key === key);
    if (fromIndex < 0) return;

    event.preventDefault();

    try {
      node.setPointerCapture(event.pointerId);
    } catch {
      return;
    }

    const rowRect = row.getBoundingClientRect();

    draggedKey = key;
    dragPointerId = event.pointerId;
    placeholderIndex = fromIndex;
    scrollContainer = getScrollContainer();
    dragClientY = event.clientY;
    dragGhost = {
      top: rowRect.top,
      left: rowRect.left,
      width: rowRect.width,
      height: rowRect.height,
      offsetX: event.clientX - rowRect.left,
      offsetY: event.clientY - rowRect.top,
    };

    params.onDragStart(key, dragGhost, fromIndex);
    startAutoScroll();
  }

  node.addEventListener('pointerdown', handlePointerDown);
  node.addEventListener('pointermove', handlePointerMove, { passive: false });
  node.addEventListener('pointerup', handlePointerUp);
  node.addEventListener('pointercancel', handlePointerCancel);

  return {
    update(newParams: ReorderDragParams) {
      params = newParams;
    },
    destroy() {
      stopAutoScroll();
      if (dragPointerId != null) {
        try {
          if (node.hasPointerCapture(dragPointerId)) {
            node.releasePointerCapture(dragPointerId);
          }
        } catch {
          // Already released.
        }
      }
      node.removeEventListener('pointerdown', handlePointerDown);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerup', handlePointerUp);
      node.removeEventListener('pointercancel', handlePointerCancel);
    },
  };
}
