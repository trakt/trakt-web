import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DragGesture } from '@use-gesture/vanilla';
import { handleDrag } from './handleDrag.ts';
import type { DragState } from './models/DragState.ts';
import type { GestureState } from './models/GestureState.ts';

const STATE_CHANGE_THRESHOLD = 0.05;

type VerticalDragProps = {
  onClose: () => void;
  parentClass: string;
  fullscreenClass: string;
  dragClass: string;
  offsetVariable: string;
};

export function verticalDrag(
  node: HTMLElement,
  { onClose, parentClass, fullscreenClass, dragClass, offsetVariable }:
    VerticalDragProps,
) {
  const parent = assertDefined(
    node.closest<HTMLElement>(`.${parentClass}`),
    'Drag handle must have a parent element',
  );

  let dragState: DragState = {
    isFullScreen: false,
    dragOffset: 0,
    threshold: globalThis.window.innerHeight * STATE_CHANGE_THRESHOLD,
    shouldClose: false,
  };

  const gesture = new DragGesture(
    node,
    (state) => {
      const {
        last,
        active,
        first,
        movement: [_, movementY],
      } = state;

      if (first && !dragState.isFullScreen) {
        parent.style.setProperty(
          '--initial-height',
          `${parent.clientHeight}px`,
        );
      }

      const gestureState: GestureState = { isStoppingDrag: last, movementY };

      dragState = handleDrag({ state: dragState, gesture: gestureState });

      parent.classList.toggle(fullscreenClass, dragState.isFullScreen);
      parent.classList.toggle(dragClass, active);
      parent.style.setProperty(offsetVariable, `${dragState.dragOffset}px`);

      dragState.shouldClose && onClose();
    },
    {
      axis: 'y',
      filterTaps: true,
      pointer: {
        touch: true,
        mouse: false,
        keys: false,
      },
    },
  );

  return {
    destroy() {
      gesture.destroy();
    },
  };
}
