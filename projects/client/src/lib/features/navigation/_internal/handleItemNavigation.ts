import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationState } from './getNavigationState.ts';
import { getNextIndex } from './getNextIndex.ts';

export const handleItemNavigation = (key: 'ArrowLeft' | 'ArrowRight') => {
  const { items, focusedIndex } = getNavigationState();

  const newIndex = getNextIndex(
    focusedIndex,
    items.length,
    key === 'ArrowRight',
  );

  focusAndScrollIntoView(items.at(newIndex));
};
