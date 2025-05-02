import { getRelevantItem } from '$lib/features/navigation/_internal/getRelevantItem.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';
import { getNavigationScope } from './getNavigationScope.ts';

export function focusSomething() {
  if (document.activeElement && document.activeElement !== document.body) {
    return;
  }

  const scope = getNavigationScope();
  const firstNavigableElement = getRelevantItem(scope);

  focusAndScrollIntoView(firstNavigableElement);
}
