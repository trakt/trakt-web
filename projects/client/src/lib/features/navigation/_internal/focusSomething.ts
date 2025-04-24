import { getRelevantItem } from '$lib/features/navigation/_internal/getRelevantItem.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';

export function focusSomething() {
  if (document.activeElement && document.activeElement !== document.body) {
    return;
  }

  const firstNavigableElement = getRelevantItem(document);
  focusAndScrollIntoView(firstNavigableElement);
}
