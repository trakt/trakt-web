import { describe, expect, it } from 'vitest';
import { handleDrag } from './handleDrag.ts';
import type { DragState } from './models/DragState.ts';
import type { GestureState } from './models/GestureState.ts';

describe('handleDrag', () => {
  const createDragState = (overrides: Partial<DragState> = {}): DragState => ({
    isFullScreen: false,
    dragOffset: 0,
    threshold: 100,
    shouldClose: false,
    ...overrides,
  });

  const createGestureState = (
    overrides: Partial<GestureState> = {},
  ): GestureState => ({
    isStoppingDrag: false,
    movementY: 0,
    ...overrides,
  });

  describe('when in full screen mode', () => {
    it('should return unchanged state for upward drag', () => {
      const state = createDragState({ isFullScreen: true });
      const gesture = createGestureState({ movementY: -50 });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual(state);
    });

    it('should update dragOffset for downward drag when not stopping', () => {
      const state = createDragState({ isFullScreen: true });
      const gesture = createGestureState({
        movementY: 50,
        isStoppingDrag: false,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        dragOffset: 50,
      });
    });

    it('should exit full screen when exceeding threshold', () => {
      const state = createDragState({
        isFullScreen: true,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: 150,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: false,
        dragOffset: 0,
      });
    });

    it('should stay in full screen when not exceeding threshold', () => {
      const state = createDragState({
        isFullScreen: true,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: 50,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: true,
        dragOffset: 0,
      });
    });
  });

  describe('when not in full screen mode', () => {
    it('should update dragOffset when not stopping drag', () => {
      const state = createDragState({ isFullScreen: false });
      const gesture = createGestureState({
        movementY: 75,
        isStoppingDrag: false,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        dragOffset: 75,
      });
    });

    it('should enter full screen for upward drag exceeding threshold', () => {
      const state = createDragState({
        isFullScreen: false,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: -150,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: true,
        dragOffset: 0,
        shouldClose: false,
      });
    });

    it('should close drawer for downward drag exceeding threshold', () => {
      const state = createDragState({
        isFullScreen: false,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: 150,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: false,
        dragOffset: 0,
        shouldClose: true,
      });
    });

    it('should not change state when drag does not exceed threshold', () => {
      const state = createDragState({
        isFullScreen: false,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: 50,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: false,
        dragOffset: 0,
        shouldClose: false,
      });
    });

    it('should not change state for upward drag not exceeding threshold', () => {
      const state = createDragState({
        isFullScreen: false,
        threshold: 100,
      });
      const gesture = createGestureState({
        movementY: -50,
        isStoppingDrag: true,
      });

      const result = handleDrag({ state, gesture });

      expect(result).toEqual({
        ...state,
        isFullScreen: false,
        dragOffset: 0,
        shouldClose: false,
      });
    });
  });
});
