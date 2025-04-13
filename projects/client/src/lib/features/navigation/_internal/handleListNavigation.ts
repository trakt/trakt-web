import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationState } from './getNavigationState.ts';
import { getNextIndex } from './getNextIndex.ts';
import { getSelectableItems } from './getSelectableItems.ts';

export const handleListNavigation = (key: 'ArrowUp' | 'ArrowDown') => {
  const { lists, currentListIndex } = getNavigationState();

  const newListIndex = getNextIndex(
    currentListIndex,
    lists.length,
    key === 'ArrowDown',
  );

  const targetList = assertDefined(lists[newListIndex], 'No list found');
  const targetItems = getSelectableItems(targetList);

  focusAndScrollIntoView(targetItems.at(0));
};
