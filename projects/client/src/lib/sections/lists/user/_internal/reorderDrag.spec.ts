import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';
import { type DragGhost, reorderDrag } from './reorderDrag.ts';

const items: readonly ReorderableListItem[] = [
  { key: 'a', listItemId: 1, rank: 1, title: 'A' },
  { key: 'b', listItemId: 2, rank: 2, title: 'B' },
  { key: 'c', listItemId: 3, rank: 3, title: 'C' },
];

function makeRow(
  key: string,
  top: number,
  height: number,
): HTMLTableRowElement {
  const row = document.createElement('tr');
  row.setAttribute('data-reorder-key', key);
  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  row.appendChild(handle);
  vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + height,
    left: 0,
    right: 100,
    width: 100,
    height,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
  return row;
}

describe('action: reorderDrag', () => {
  let node: HTMLTableSectionElement;
  let rowA: HTMLTableRowElement;
  let rowB: HTMLTableRowElement;
  let rowC: HTMLTableRowElement;
  let onDragStart: Mock<
    (key: string, ghost: DragGhost, fromIndex: number) => void
  >;
  let onGhostMove: Mock<(ghost: DragGhost) => void>;
  let onPlaceholderMove: Mock<(index: number) => void>;
  let onDragEnd: Mock<
    (
      key: string | null,
      placeholderIndex: number | null,
      cancelled: boolean,
    ) => void
  >;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    node = document.createElement('tbody') as HTMLTableSectionElement;
    // jsdom does not implement pointer capture — assign stubs directly
    (node as unknown as Record<string, unknown>).setPointerCapture = vi.fn();
    (node as unknown as Record<string, unknown>).hasPointerCapture = vi
      .fn()
      .mockReturnValue(false);
    (node as unknown as Record<string, unknown>).releasePointerCapture =
      vi.fn();

    rowA = makeRow('a', 0, 50);
    rowB = makeRow('b', 50, 50);
    rowC = makeRow('c', 100, 50);
    node.appendChild(rowA);
    node.appendChild(rowB);
    node.appendChild(rowC);
    document.body.appendChild(node);

    onDragStart = vi.fn();
    onGhostMove = vi.fn();
    onPlaceholderMove = vi.fn();
    onDragEnd = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(node);
    vi.unstubAllGlobals();
  });

  function createAction(
    overrides: Partial<Parameters<typeof reorderDrag>[1]> = {},
  ) {
    return reorderDrag(node, {
      getItems: () => items,
      onDragStart,
      onGhostMove,
      onPlaceholderMove,
      onDragEnd,
      ...overrides,
    });
  }

  function pointerDown(
    target: HTMLElement,
    { button = 0, pointerId = 1, clientX = 50, clientY = 25 } = {},
  ) {
    const dispatchTarget = target.querySelector('.drag-handle') ?? target;
    dispatchTarget.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button,
        pointerId,
        clientX,
        clientY,
      }),
    );
  }

  function pointerMove({ pointerId = 1, clientX = 60, clientY = 40 } = {}) {
    node.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerId,
        clientX,
        clientY,
      }),
    );
  }

  function pointerUp({ pointerId = 1 } = {}) {
    node.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, pointerId }),
    );
  }

  function pointerCancel({ pointerId = 1 } = {}) {
    node.dispatchEvent(
      new PointerEvent('pointercancel', { bubbles: true, pointerId }),
    );
  }

  describe('pointerdown', () => {
    it('should ignore non-primary button', () => {
      createAction();
      pointerDown(rowA, { button: 2 });
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should ignore elements without the row attribute', () => {
      const cell = document.createElement('td');
      node.appendChild(cell);
      createAction();
      pointerDown(cell);
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should ignore keys not present in the items list', () => {
      const unknownRow = makeRow('unknown', 150, 50);
      node.appendChild(unknownRow);
      createAction();
      pointerDown(unknownRow);
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should call onDragStart with key, ghost geometry, and fromIndex', () => {
      createAction();
      pointerDown(rowA, { clientX: 50, clientY: 25 });
      expect(onDragStart).toHaveBeenCalledWith(
        'a',
        { top: 0, left: 0, width: 100, height: 50, offsetX: 50, offsetY: 25 },
        0,
      );
    });

    it('should resolve fromIndex from item position in list', () => {
      createAction();
      pointerDown(rowB, { clientX: 20, clientY: 60 });
      expect(onDragStart).toHaveBeenCalledWith(
        'b',
        expect.objectContaining({ top: 50 }),
        1,
      );
    });

    it('should start the auto-scroll loop', () => {
      createAction();
      pointerDown(rowA);
      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('pointermove', () => {
    it('should ignore events from a different pointer', () => {
      createAction();
      pointerDown(rowA);
      pointerMove({ pointerId: 99 });
      expect(onGhostMove).not.toHaveBeenCalled();
    });

    it('should call onGhostMove with updated position offset by initial grab point', () => {
      createAction();
      pointerDown(rowA, { clientX: 50, clientY: 25 }); // offsetX=50, offsetY=25
      pointerMove({ clientX: 60, clientY: 40 }); // left=60-50=10, top=40-25=15
      expect(onGhostMove).toHaveBeenCalledWith(
        expect.objectContaining({ left: 10, top: 15 }),
      );
    });

    it('should call onPlaceholderMove when the drop index changes', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 }); // placeholderIndex = 0
      // rowA mid = 25, rowB mid = 75: clientY=40 lands in rowB slot → index 1
      pointerMove({ clientY: 40 });
      expect(onPlaceholderMove).toHaveBeenCalledWith(1);
    });

    it('should not call onPlaceholderMove when the drop index is unchanged', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 }); // placeholderIndex = 0
      // clientY=10 < rowA mid=25 → index 0, same as current
      pointerMove({ clientY: 10 });
      expect(onPlaceholderMove).not.toHaveBeenCalled();
    });

    it('should return last-row index when pointer is below all rows', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 }); // placeholderIndex = 0
      // clientY=200 > all row midpoints → index = rows.length = 3
      pointerMove({ clientY: 200 });
      expect(onPlaceholderMove).toHaveBeenCalledWith(3);
    });
  });

  describe('pointerup', () => {
    it('should ignore events from a different pointer', () => {
      createAction();
      pointerDown(rowA);
      pointerUp({ pointerId: 99 });
      expect(onDragEnd).not.toHaveBeenCalled();
    });

    it('should call onDragEnd with cancelled=false at the initial index', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 });
      pointerUp();
      expect(onDragEnd).toHaveBeenCalledWith('a', 0, false);
    });

    it('should call onDragEnd with the final placeholder index after moves', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 });
      pointerMove({ clientY: 40 }); // moves to index 1
      pointerUp();
      expect(onDragEnd).toHaveBeenCalledWith('a', 1, false);
    });
  });

  describe('pointercancel', () => {
    it('should ignore events from a different pointer', () => {
      createAction();
      pointerDown(rowA);
      pointerCancel({ pointerId: 99 });
      expect(onDragEnd).not.toHaveBeenCalled();
    });

    it('should call onDragEnd with cancelled=true', () => {
      createAction();
      pointerDown(rowA, { clientY: 25 });
      pointerCancel();
      expect(onDragEnd).toHaveBeenCalledWith('a', 0, true);
    });
  });

  describe('update', () => {
    it('should use the new params for subsequent drag events', () => {
      const action = createAction();
      const newOnDragStart =
        vi.fn<(key: string, ghost: DragGhost, fromIndex: number) => void>();
      action.update({
        getItems: () => items,
        onDragStart: newOnDragStart,
        onGhostMove,
        onPlaceholderMove,
        onDragEnd,
      });
      pointerDown(rowA);
      expect(newOnDragStart).toHaveBeenCalled();
      expect(onDragStart).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove all four pointer event listeners', () => {
      const action = createAction();
      const spy = vi.spyOn(node, 'removeEventListener');
      action.destroy();
      expect(spy).toHaveBeenCalledTimes(4);
    });

    it('should stop the auto-scroll loop if a drag is in progress', () => {
      const action = createAction();
      pointerDown(rowA);
      action.destroy();
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('custom rowDataAttribute', () => {
    it('should use the provided attribute name to identify draggable rows', () => {
      const customRow = document.createElement('tr');
      customRow.setAttribute('data-list-row', 'a');
      const customHandle = document.createElement('div');
      customHandle.className = 'drag-handle';
      customRow.appendChild(customHandle);
      vi.spyOn(customRow, 'getBoundingClientRect').mockReturnValue(
        rowA.getBoundingClientRect(),
      );
      node.innerHTML = '';
      node.appendChild(customRow);

      createAction({ rowDataAttribute: 'data-list-row' });
      pointerDown(customRow);
      expect(onDragStart).toHaveBeenCalledWith('a', expect.any(Object), 0);
    });
  });

  describe('drag handle', () => {
    it('should ignore presses outside the drag handle', () => {
      createAction();

      rowA.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0 }),
      );

      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should use a custom handle selector', () => {
      const grip = document.createElement('span');
      grip.className = 'grip';
      rowB.appendChild(grip);
      createAction({ dragHandleSelector: '.grip' });

      rowB
        .querySelector('.drag-handle')
        ?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onDragStart).not.toHaveBeenCalled();

      grip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onDragStart).toHaveBeenCalledWith('b', expect.any(Object), 1);
    });
  });

  describe('pointer capture', () => {
    const capture = () => node as unknown as Record<string, Mock>;

    it('should capture the pointer for the drag', () => {
      createAction();

      pointerDown(rowA, { pointerId: 7 });

      expect(capture().setPointerCapture).toHaveBeenCalledWith(7);
    });

    it('should not start a drag when the pointer cannot be captured', () => {
      capture().setPointerCapture?.mockImplementation(() => {
        throw new Error('gone');
      });
      createAction();

      pointerDown(rowA);

      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should release a held pointer when the drag ends', () => {
      capture().hasPointerCapture?.mockReturnValue(true);
      createAction();
      pointerDown(rowA, { pointerId: 7 });

      pointerUp({ pointerId: 7 });

      expect(capture().releasePointerCapture).toHaveBeenCalledWith(7);
    });

    it('should still end the drag when releasing the pointer throws', () => {
      capture().hasPointerCapture?.mockReturnValue(true);
      capture().releasePointerCapture?.mockImplementation(() => {
        throw new Error('already released');
      });
      createAction();
      pointerDown(rowA);

      pointerCancel();

      expect(onDragEnd).toHaveBeenCalledWith('a', 0, true);
    });

    it('should release a held pointer when destroyed mid drag', () => {
      capture().hasPointerCapture?.mockReturnValue(true);
      const action = createAction();
      pointerDown(rowA, { pointerId: 7 });

      action.destroy();

      expect(capture().releasePointerCapture).toHaveBeenCalledWith(7);
    });

    it('should forget the drag once it ended', () => {
      createAction();
      pointerDown(rowA);
      pointerUp();

      pointerMove({ clientY: 90 });

      expect(onGhostMove).not.toHaveBeenCalled();
      expect(onDragEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('auto scroll', () => {
    let container: HTMLDivElement;

    const frames = () => vi.mocked(requestAnimationFrame).mock.calls;

    const tick = () => {
      const callback = frames().at(-1)?.[0];
      callback?.(0);
    };

    const defineContainer = ({
      top = 0,
      bottom = 300,
      scrollTop = 100,
      scrollHeight = 1000,
    } = {}) => {
      container = document.createElement('div');
      container.className = 'trakt-drawer-content';
      container.getBoundingClientRect = () =>
        ({ top, bottom, height: bottom - top }) as DOMRect;
      Object.defineProperty(container, 'scrollHeight', {
        value: scrollHeight,
      });
      Object.defineProperty(container, 'clientHeight', {
        value: bottom - top,
      });
      container.scrollTop = scrollTop;
      Object.defineProperty(container, 'scrollTop', {
        value: scrollTop,
        writable: true,
      });
      document.body.appendChild(container);
      container.appendChild(node);
    };

    afterEach(() => {
      document.body.appendChild(node);
      container?.remove();
    });

    it('should scroll up faster the closer the pointer is to the top edge', () => {
      defineContainer();
      createAction();
      pointerDown(rowA, { clientY: 60 });
      tick();
      const far = 100 - container.scrollTop;

      container.scrollTop = 100;
      pointerMove({ clientY: 10 });
      tick();
      const near = 100 - container.scrollTop;

      expect(far).toBeGreaterThan(0);
      expect(near).toBeGreaterThan(far);
    });

    it('should scroll down near the bottom edge', () => {
      defineContainer();
      createAction();
      pointerDown(rowA, { clientY: 290 });

      tick();

      expect(container.scrollTop).toBeGreaterThan(100);
    });

    it('should move the placeholder when scrolling changes what is under the pointer', () => {
      defineContainer();
      createAction();
      pointerDown(rowA, { clientY: 60 });

      tick();

      expect(onPlaceholderMove).toHaveBeenCalledWith(1);
    });

    it('should not scroll when the pointer is away from the edges', () => {
      defineContainer({ top: 0, bottom: 1000 });
      createAction();
      pointerDown(rowA, { clientY: 500 });

      tick();

      expect(container.scrollTop).toBe(100);
    });

    it('should not scroll above the top of the content', () => {
      defineContainer({ scrollTop: 0 });
      createAction();
      pointerDown(rowA, { clientY: 10 });

      tick();

      expect(container.scrollTop).toBe(0);
    });

    it('should not scroll past the end of the content', () => {
      defineContainer({ scrollTop: 700 });
      createAction();
      pointerDown(rowA, { clientY: 290 });

      tick();

      expect(container.scrollTop).toBe(700);
    });

    it('should use a custom scroll container class', () => {
      defineContainer();
      container.className = 'custom-scroll';
      createAction({ scrollContainerClassName: 'custom-scroll' });
      pointerDown(rowA, { clientY: 60 });

      tick();

      expect(container.scrollTop).toBeLessThan(100);
    });

    it('should not scroll when there is no scroll container', () => {
      createAction();
      pointerDown(rowA, { clientY: 60 });

      tick();

      expect(onPlaceholderMove).not.toHaveBeenCalled();
    });
  });
});
