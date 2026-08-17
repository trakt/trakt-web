import type { DragState } from './models/DragState.ts';
import type { GestureState } from './models/GestureState.ts';

type HandleDragProps = {
  state: DragState;
  gesture: GestureState;
};

export function handleDrag({ state, gesture }: HandleDragProps): DragState {
  const { movementY, isStoppingDrag } = gesture;
  const isUpwardDrag = movementY < 0;

  if (state.isFullScreen && isUpwardDrag) {
    return state;
  }

  if (!isStoppingDrag) {
    return {
      ...state,
      dragOffset: movementY,
      shouldClose: false,
    };
  }

  const exceedsThreshold = Math.abs(movementY) > state.threshold;

  if (state.isFullScreen) {
    return {
      ...state,
      isFullScreen: !exceedsThreshold,
      dragOffset: 0,
      shouldClose: false,
    };
  }

  const shouldClose = !isUpwardDrag && exceedsThreshold;

  return {
    ...state,
    dragOffset: shouldClose ? movementY : 0,
    isFullScreen: isUpwardDrag && exceedsThreshold,
    shouldClose,
  };
}
