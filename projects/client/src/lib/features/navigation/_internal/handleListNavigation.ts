import { getRelevantItem } from '$lib/features/navigation/_internal/getRelevantItem.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationScope } from './getNavigationScope.ts';
import { getNavigationState } from './getNavigationState.ts';
import { getNextIndex } from './getNextIndex.ts';

const LIST_SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

export const handleListNavigation = (key: 'ArrowUp' | 'ArrowDown') => {
  const { lists, currentListIndex } = getNavigationState(
    DpadNavigationType.List,
  );

  const newListIndex = getNextIndex(
    currentListIndex,
    lists.length,
    key === 'ArrowDown',
  );

  const targetList = assertDefined(lists[newListIndex], 'No list found');
  const targetItem = getRelevantItem(targetList);

  const isFirstList = newListIndex === 0;
  const isLastList = newListIndex === lists.length - 1;
  const scope = getNavigationScope();

  // Trigger scrolling only when the navigation scope is the document.
  // This ensures that navigating to the first or last list scrolls the page
  // to the top or bottom, respectively, for a seamless user experience.
  if (scope === document && (isFirstList || isLastList)) {
    globalThis.window.scrollTo({
      top: isFirstList ? 0 : document.documentElement.scrollHeight,
      behavior: LIST_SCROLL_BEHAVIOR,
    });
  }

  focusAndScrollIntoView(targetItem, LIST_SCROLL_BEHAVIOR);
};
