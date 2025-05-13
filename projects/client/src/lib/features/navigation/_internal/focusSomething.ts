import { getRelevantItem } from '$lib/features/navigation/_internal/getRelevantItem.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationScope } from './getNavigationScope.ts';
import { waitForDynamicContent } from './waitForDynamicContent.ts';

export async function focusSomething(isRefocus = false) {
  const hasValidFocusedElement = document.activeElement &&
    document.activeElement !== document.body;

  if (!isRefocus && hasValidFocusedElement) {
    return;
  }

  if (isRefocus) {
    await waitForDynamicContent();
  }

  const scope = getNavigationScope();
  const firstNavigableElement = getRelevantItem(scope);

  focusAndScrollIntoView(firstNavigableElement);
}
