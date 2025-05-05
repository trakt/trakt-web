import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationState } from './getNavigationState.ts';
import { getNextIndex } from './getNextIndex.ts';

export function handleNavbarNavigation(key: 'ArrowUp' | 'ArrowDown') {
  const { items, focusedIndex } = getNavigationState(
    DpadNavigationType.Navbar,
  );

  const newIndex = getNextIndex(
    focusedIndex,
    items.length,
    key === 'ArrowDown',
  );

  focusAndScrollIntoView(items.at(newIndex));
}
