import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { getNavigationState } from './getNavigationState.ts';

export function isEnteringNavbar(
  key: 'ArrowLeft' | 'ArrowRight',
) {
  const { focusedIndex } = getNavigationState(DpadNavigationType.List);
  return focusedIndex === 0 && key === 'ArrowLeft';
}
