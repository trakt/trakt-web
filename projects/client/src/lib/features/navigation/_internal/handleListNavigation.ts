import { getRelevantItem } from '$lib/features/navigation/_internal/getRelevantItem.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationState } from './getNavigationState.ts';
import { getNextIndex } from './getNextIndex.ts';

const LIST_SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

export const handleListNavigation = (key: 'ArrowUp' | 'ArrowDown') => {
  const { lists, currentListIndex } = getNavigationState();

  const newListIndex = getNextIndex(
    currentListIndex,
    lists.length,
    key === 'ArrowDown',
  );

  const targetList = assertDefined(lists[newListIndex], 'No list found');
  const targetItem = getRelevantItem(targetList);

  const isFirstList = newListIndex === 0;
  const isLastList = newListIndex === lists.length - 1;

  if (isFirstList || isLastList) {
    globalThis.window.scrollTo({
      top: isFirstList ? 0 : document.documentElement.scrollHeight,
      behavior: LIST_SCROLL_BEHAVIOR,
    });
  }

  focusAndScrollIntoView(targetItem, LIST_SCROLL_BEHAVIOR);
};
